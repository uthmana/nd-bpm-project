import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { hash } from 'bcryptjs';
import { checkUserRole } from 'utils/auth';
import { Prisma } from '@prisma/client';
import { validateCustomerSchema } from 'utils/validate';

//Get single customer
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }

    const id1 = route.params.id;
    const customer = await prisma.customer.findUnique({
      where: { id: id1 },
    });

    if (!customer) {
      return NextResponse.json({ message: 'Customer not found' });
    }
    if (!customer.id)
      return NextResponse.json({ message: 'Customer not found' });
    return NextResponse.json({ ...customer, password: '' });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Update Customer
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: Partial<Prisma.CustomerUpdateInput> = await req.json();

    // Validate the fields against the customer schema
    const validationErrors = await validateCustomerSchema(result);

    if (validationErrors.length > 0) {
      return NextResponse.json({
        error: 'Invalid data format',
        details: validationErrors,
      });
    }

    const customer: Partial<customer> = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return NextResponse.json(
        { message: 'Customer not found.' },
        { status: 404 },
      );
    }

    const updateCustomer = await prisma.customer.update({
      where: {
        id: id,
      },
      data: {
        ...customer,
      },
    });

    if (updateCustomer) {
      return NextResponse.json(updateCustomer, { status: 200 });
    }
  } catch (error) {
    console.error('Error updating customer', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Delete Customer
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }

    const id = route.params.id;
    const deletedCustomer = await prisma.customer.delete({
      where: {
        id: id,
      },
    });
    if (deletedCustomer) {
      return NextResponse.json({ deletedCustomer }, { status: 200 });
    }
  } catch (error) {
    console.error('Error updating customer', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
