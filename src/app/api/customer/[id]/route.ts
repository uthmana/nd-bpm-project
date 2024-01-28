import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { checkUserRole } from 'utils/auth';
import { validateCustomerSchema } from 'utils/validate';
import { CardType, Currency, Customer, Prisma } from '@prisma/client';

//Get single customer
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    // const allowedRoles = ['ADMIN'];
    // const hasrole = await checkUserRole(allowedRoles);
    // if (!hasrole) {
    //   return NextResponse.json({ error: 'Access forbidden', status: 403 });
    // }

    const id = route.params.id;
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return NextResponse.json({ message: 'Customer not found' });
    }
    if (!customer.id)
      return NextResponse.json({ message: 'Customer not found' });
    return NextResponse.json({ ...customer });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientRustPanicError
    ) {
      return NextResponse.json(e, { status: 403 });
    }
    return NextResponse.json(e, { status: 500 });
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
      return NextResponse.json({
        error: 'Invalid data format',
        details: validationErrors,
      });
    }

    const customer: Customer = await prisma.customer.findUnique({
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
        ...newCustomerData,
      },
    });

    if (updateCustomer) {
      return NextResponse.json(updateCustomer, { status: 200 });
    }
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientRustPanicError
    ) {
      return NextResponse.json(e, { status: 403 });
    }
    return NextResponse.json(e, { status: 500 });
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
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientRustPanicError
    ) {
      return NextResponse.json(e, { status: 403 });
    }
    return NextResponse.json(e, { status: 500 });
  }
}
