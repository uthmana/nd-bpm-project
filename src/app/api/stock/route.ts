import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Prisma, Stock } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

//All Stocks
export async function GET(req: NextRequest) {
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

    const inventory = req.nextUrl.searchParams.get('inventory') === 'true';

    let stocks;
    if (inventory) {
      // Retrieve stock where inventory is zero
      stocks = await prisma.stock.findMany({
        where: { inventory: 0 },
        include: { customer: true },
        orderBy: { date: 'desc' },
      });
    } else {
      // Retrieve all stock data where inventory is greater than zero
      stocks = await prisma.stock.findMany({
        where: { inventory: { gt: 0 } }, // 'gt' stands for 'greater than'
        include: { customer: true, defaultTechParameter: true },
        orderBy: { date: 'desc' },
      });
    }

    return NextResponse.json(stocks, { status: 200 });
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
    const result: Stock | any = await req.json();
    const { product_name, product_code, customerId } = result;

    if (!customerId || !product_name || !product_code) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    let stockData: any = { ...result };
    delete stockData.customerId;

    const stock = await prisma.stock.create({
      data: {
        ...stockData,
        customer: { connect: { id: customerId } },
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
