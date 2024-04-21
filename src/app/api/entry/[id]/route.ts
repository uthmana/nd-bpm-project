import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { Fault, Prisma, Process, Stock } from '@prisma/client';

//Get single Fault
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const fault: Fault = await prisma.fault.findUnique({
      where: { id: id },
      include: { faultControl: true, unacceptable: true },
    });
    return NextResponse.json(fault, { status: 200 });
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

//Update Fault
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: Fault = await req.json();
    const {
      customerName,
      productCode,
      quantity,
      application,
      product_barcode,
    } = result;

    if (!customerName || !productCode || !quantity || !application) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const fault: Fault = await prisma.fault.findUnique({
      where: { id },
    });

    if (!fault) {
      return NextResponse.json({ message: 'No such fault' }, { status: 401 });
    }
    const updateFault = await prisma.fault.update({
      where: {
        id: id,
      },
      data: {
        ...result,
      },
    });

    //Tracking Stock
    if (updateFault) {
      const {
        customerId,
        productCode,
        product,
        technicalDrawingAttachment,
        productBatchNumber,
      } = updateFault;

      const stockData = await prisma.stock.findUnique({
        where: {
          product_code: updateFault.productCode,
          customerId: updateFault.customerId,
        },
      });

      if (stockData) {
        let qty = stockData.inventory;
        if (fault.quantity !== quantity) {
          const _qtyDiff = fault.quantity - quantity;
          qty = _qtyDiff < 0 ? qty + _qtyDiff * -1 : qty - _qtyDiff;
        }
        const stock: Stock = await prisma.stock.update({
          where: {
            product_code: updateFault.productCode,
          },
          data: {
            product_code: productCode,
            product_name: product,
            inventory: qty,
            current_price: '',
            curency: '',
            image: technicalDrawingAttachment,
            customerId: customerId,
            product_barcode,
            productBatchNumber,
          },
        });
      }
    }
    return NextResponse.json(updateFault, { status: 200 });
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

//Delete Fault
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedFault: Fault = await prisma.fault.delete({
      where: {
        id: id,
      },
    });

    //Tracking stock
    if (deletedFault) {
      const stockData = await prisma.stock.findUnique({
        where: {
          product_code: deletedFault.productCode,
          customerId: deletedFault.customerId,
        },
      });
      if (stockData) {
        const diffQty = stockData.inventory - deletedFault.quantity;
        const qty = diffQty > stockData.inventory ? 0 : diffQty;
        const updateStock = await prisma.stock.update({
          where: {
            product_code: deletedFault.productCode,
          },
          data: { inventory: qty },
        });
      }
    }

    return NextResponse.json(deletedFault, { status: 200 });
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
