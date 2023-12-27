import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { hash } from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { validateCustomerSchema } from 'utils/validate';

//All customers
export async function GET(req: NextRequest) {
  try {
    const customers = await prisma.customer.findMany();
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

// Create Customer
export async function PUT(req: Request) {
  try {
    const result: Prisma.CustomerCreateInput = await req.json();

    // Validate the fields against the customer schema
    const validationErrors = await validateCustomerSchema(result);
    if (validationErrors.length > 0) {
      return NextResponse.json({
        error: 'Invalid data format',
        details: validationErrors,
      });
    }
    // Hash the password
    const hashedPassword = await hash(result.password, 12);

    // Exclude email and password from direct inclusion in the data object
    const { email, password, ...data } = result;

    // Include other properties using the spread operator
    const customer = await prisma.customer.create({
      data: {
        ...data,
        email: email?.toLocaleLowerCase() ?? '',
        password: hashedPassword,
      },
    });

    return NextResponse.json({ customer }, { status: 200 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 404 },
      );
    }
    return NextResponse.json({
      error: 'Error occurred while creating customer',
    });
  }
}
