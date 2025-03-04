import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Fault, Prisma, Stock } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

//All Faults
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['NORMAL', 'TECH', 'ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const fault = await prisma.fault.findMany({
      include: {
        faultControl: true,
        defaultTechParameter: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(fault, { status: 200 });
  } catch (e) {
    console.log({ e });
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

export async function POST(req: NextRequest) {
  try {
    const allowedRoles = ['NORMAL', 'TECH', 'ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }

    const filters: Fault | any = await req.json();
    const fault = await prisma.fault.findMany(filters);

    return NextResponse.json(fault, { status: 200 });
  } catch (e) {
    console.log({ e });
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
    const allowedRoles = ['NORMAL', 'ADMIN', 'SUPER', 'TECH'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
    const result: Fault | any = await req.json();
    const { customerName, application, product_barcode, customerId } = result;

    if (!customerId || !customerName || !application || !product_barcode) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const tempDefaultParams = result?.defaultTechParameter;
    let tempFault = { ...result };

    delete tempFault.defaultTechParameter;
    delete tempFault.customerId;
    delete tempFault.customerName;

    const fault = await prisma.fault.create({
      data: {
        ...tempFault,
        defaultTechParameter: {
          create: tempDefaultParams,
        },
        customer: { connect: { id: customerId } },
      },
    });

    if (fault) {
      const {
        customerId,
        productCode,
        quantity,
        product,
        technicalDrawingAttachment,
        productBatchNumber,
      } = fault;

      const stock = await prisma.stock.create({
        data: {
          product_code: productCode,
          product_name: product,
          inventory: quantity,
          image: technicalDrawingAttachment,
          customerId: customerId,
          faultId: fault.id,
          current_price: '',
          product_barcode,
          productBatchNumber,
          defaultTechParameter: {
            create: tempDefaultParams,
          },
        },
      });
    }

    return NextResponse.json({ fault }, { status: 200 });
  } catch (e) {
    console.log({ e });
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
