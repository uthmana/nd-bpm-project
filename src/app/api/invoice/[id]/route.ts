import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { Fault, Invoice, Prisma, Process } from '@prisma/client';

//Get single Invoice
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const invoice: Invoice = await prisma.invoice.findUnique({
      where: { id: id },
    });
    return NextResponse.json(invoice, { status: 200 });
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

//Update Invoice
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: any = await req.json();
    const {
      invoiceDate,
      createdBy,
      customerId,
      tax_Office,
      taxNo,
      process,
      rep_name,
      description,
      totalAmount,
      vat,
      amount,
      address,
    } = result;
    if (
      process.length === 0 ||
      !customerId ||
      !invoiceDate ||
      !tax_Office ||
      !taxNo ||
      !address
    ) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }
    const invoice: Invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    const updateInvoice = await prisma.invoice.update({
      where: {
        id: id,
      },
      data: {
        ...result,
      },
    });

    return NextResponse.json(updateInvoice, { status: 200 });
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

//Delete Invoice
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedInvoice = await prisma.invoice.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json([deletedInvoice], { status: 200 });
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
