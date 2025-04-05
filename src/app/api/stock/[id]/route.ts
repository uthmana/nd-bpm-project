import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Stock } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//Get single Stock
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const stock: Stock = await prisma.stock.findUnique({
      where: { id: id },
      include: { customer: true },
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

//Update Stock
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: Stock = await req.json();
    const { product_name, product_code } = result;

    if (!product_name || !product_code) {
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
