import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Stock } from '@prisma/client';

//All Stocks
export async function GET(req: NextRequest) {
  try {
    const stock = await prisma.stock.findMany();
    if (!stock) {
      throw new Error('No stock found');
    }
    return NextResponse.json(stock, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
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
    if (!stock) {
      throw new Error('No stock found');
    }

    return NextResponse.json({ stock }, { status: 200 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Error ocured while creating stock' },
        { status: 404 },
      );
    }
    return NextResponse.json({ error: 'Error ocured while creating stock' });
  }
}
