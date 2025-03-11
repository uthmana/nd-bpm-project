import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { validateCustomerSchema } from 'utils';
import { Customer } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//Get single customer
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        Fault: true,
      },
    });
    return NextResponse.json(customer);
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

//Update Customer
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const newCustomerData: Customer = await req.json();

    // Validate the fields against the customer schema
    const validationErrors = await validateCustomerSchema(newCustomerData);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const customer: Customer = await prisma.customer.findUnique({
      where: { id },
    });

    const updateCustomer = await prisma.customer.update({
      where: {
        id: id,
      },
      data: {
        ...newCustomerData,
      },
    });
    return NextResponse.json(updateCustomer, { status: 200 });
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

//Delete Customer
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const id = route.params.id;
    const deletedCustomer = await prisma.customer.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(deletedCustomer, { status: 200 });
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
