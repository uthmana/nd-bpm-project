import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Fault, Invoice, Prisma } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

//All Faults
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['NORMAL', 'ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const invoice = await prisma.invoice.findMany({
      include: { customer: true, process: true },
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

// Create Fault
export async function PUT(req: Request) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const allowedRoles = ['NORMAL', 'ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }

    //TODO: set process type
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

    const invoice = await prisma.invoice.create({
      data: {
        invoiceDate,
        createdBy,
        customerId,
        tax_Office,
        taxNo,
        rep_name,
        description,
        totalAmount,
        vat,
        amount,
      },
    });

    const processUpdate = await Promise.all(
      process.map(async (item) => {
        const updatedProcess = await prisma.process.update({
          where: {
            id: item.id,
          },
          data: { invoiceId: invoice.id },
        });
      }),
    );

    //TODO: Create Notification to customer

    return NextResponse.json(invoice, { status: 200 });
  } catch (e) {
    console.log(e);
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
