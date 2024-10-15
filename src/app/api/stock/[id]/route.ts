import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { Prisma, Stock } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

//Get single Stock
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    //check roles and permission of user
    const allowedRoles = ['SUPER', 'ADMIN', 'NORMAL', 'TECH'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
    const id = route.params.id;
    const stock: Stock = await prisma.stock.findUnique({
      where: { id: id },
      include: { customer: true },
    });
    return NextResponse.json(stock, { status: 200 });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientRustPanicError
    ) {
      console.log(e);
      return NextResponse.json(e, { status: 403 });
    }
    return NextResponse.json(e, { status: 500 });
  }
}

//Update Stock
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: Stock = await req.json();
    const { product_name, product_code, curency } = result;

    if (!product_name || !product_code || !curency) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const stock: Stock = await prisma.stock.findUnique({
      where: { id },
    });

    const updateStock = await prisma.stock.update({
      where: {
        id: id,
      },
      data: {
        ...result,
      },
    });

    return NextResponse.json(updateStock, { status: 200 });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientRustPanicError
    ) {
      console.log(e);
      return NextResponse.json(e, { status: 403 });
    }
    return NextResponse.json(e, { status: 500 });
  }
}

//Delete stock
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const id = route.params.id;
    const deletedStock = await prisma.stock.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(deletedStock, { status: 200 });
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
