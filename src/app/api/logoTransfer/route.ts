import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { checkUserRole } from 'utils/auth';

export async function POST(req: Request) {
  try {
    const allowedRoles = ['NORMAL', 'ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }

    const logodata = await req.json();
    console.log(logodata);

    const insertedlogoinvoice = await prisma.logoTransfer.create({
      data: {
        DATE: logodata.DATE,
        NUMBER: logodata.NUMBER,
        INTERNAL_REF: logodata.INTERNAL_REF,
        INVOICE_NUMBER: logodata.INVOICE_NUMBER,
        DOC_NUMBER: logodata.DOC_NUMBER,
        TYPE: logodata.TYPE,
        transferType: logodata.transferType,
      },
    });
    console.log(insertedlogoinvoice);
    return NextResponse.json(insertedlogoinvoice, { status: 200 });
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

export async function GET(req: Request) {
  try {
    var logodata = await req.json();

    console.log(logodata);
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
