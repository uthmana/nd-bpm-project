import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Prisma, Stock } from '@prisma/client';

//All Stocks
export async function GET(req: NextRequest) {
  try {
    const stock = await prisma.stock.findMany({
      include: { customer: true },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(stock, { status: 200 });
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

// Create stock
export async function PUT(req: Request) {
  try {
    const result: Stock = await req.json();

    const { product_name, product_code, current_price, curency } = result;

    if (!product_name || !product_code || !current_price || !curency) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }
    const stock = await prisma.stock.create({
      data: result,
    });
    return NextResponse.json(stock, { status: 200 });
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
