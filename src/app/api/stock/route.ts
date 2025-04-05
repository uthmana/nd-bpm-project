import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Stock } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//All Stocks
export async function GET(req: NextRequest) {
  try {
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
