import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Customer, Prisma } from '@prisma/client';
import { validateCustomerSchema } from 'utils';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//All customers
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const stock = searchParams.get('stock');
    if (stock && stock === 'true') {
      const customers = await prisma.customer.findMany({
        include: {
          Stock: {
            include: {
              defaultTechParameter: true,
            },
          },
        },
        orderBy: { company_name: 'asc' },
      });

      return NextResponse.json(customers, { status: 200 });
    }

    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(customers, { status: 200 });
  } catch (e) {
    console.error('Prisma Error:', e);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      {
        error: userMessage,
        details: technicalMessage,
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const filters: Customer | any = await req.json();
    const customers = await prisma.customer.findMany(filters);

    return NextResponse.json(customers, { status: 200 });
  } catch (e) {
    console.error('Prisma Error:', e);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      {
        error: userMessage,
        details: technicalMessage,
      },
      { status: 500 },
    );
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
    // Exclude email and password from direct inclusion in the data object
    const { email, ...data } = result;

    // Include other properties using the spread operator
    const customer = await prisma.customer.create({
      data: {
        ...data,
        email: email?.toLocaleLowerCase() ?? '',
      },
    });

    return NextResponse.json(customer, { status: 200 });
  } catch (e) {
    console.error('Prisma Error:', e);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      {
        error: userMessage,
        details: technicalMessage,
      },
      { status: 500 },
    );
  }
}
