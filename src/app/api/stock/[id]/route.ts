import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { Stock } from '@prisma/client';

//Get single Stock
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const stock: Stock = await prisma.stock.findUnique({
      where: { id: id },
    });
    if (!stock) {
      throw new Error('Stock not found');
    }
    return NextResponse.json(stock, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Update Stock
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: Stock = await req.json();
    const { product_name, product_code, current_price, curency } = result;

    if (!product_name || !product_code || !current_price || !curency) {
      throw new Error('You are missing a required data');
    }

    const stock: Stock = await prisma.stock.findUnique({
      where: { id },
    });

    if (!stock) {
      return NextResponse.json(
        { message: 'Stock not found.' },
        { status: 404 },
      );
    }

    const updateStock = await prisma.stock.update({
      where: {
        id: id,
      },
      data: {
        ...result,
      },
    });
    if (!updateStock) {
      return NextResponse.json(
        { error: 'Error occuired while updating stock' },
        { status: 401 },
      );
    }
    return NextResponse.json(updateStock, { status: 200 });
  } catch (error) {
    console.error('Error updating user', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Delete user
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
    if (!deletedStock) {
      return NextResponse.json(
        { error: 'Error occuired while deleting stock' },
        { status: 401 },
      );
    }
    return NextResponse.json(deletedStock, { status: 200 });
  } catch (error) {
    console.error('Internal Server Error', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
