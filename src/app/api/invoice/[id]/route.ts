import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Invoice } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//Get single Invoice
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const invoice: Invoice = await prisma.invoice.findUnique({
      where: { id: id },
      include: { Fault: true, customer: true },
    });
    return NextResponse.json(invoice, { status: 200 });
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

//Update Invoice
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: Invoice | any = await req.json();
    const {
      Fault,
      customer,
      barcode,
      id: invoiceId,
      customerId,
      ...rest
    } = result;

    if (!Fault || !customer) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }
    const invoiceData = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoiceData) {
      return NextResponse.json(
        { message: 'Invoice not found' },
        { status: 404 },
      );
    }
    const invoice: Invoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...rest,
        customer: { connect: { id: customer.id } },
        Fault: { connect: Fault.map((item) => ({ id: item.id })) },
      },
      include: {
        Fault: true,
        customer: true,
      },
    });

    if (invoice) {
      const updateFault = await prisma.fault.updateMany({
        where: {
          id: { in: Fault.map((item) => item.id) },
        },
        data: {
          status: 'SEVKIYAT_TAMAMLANDI',
          invoiceDate: invoice.createdAt,
        },
      });

      // Handle Stock Updates
      for (const faultItem of Fault) {
        const { id: faultId, shipmentQty, quantity, productCode } = faultItem;

        if (!shipmentQty || !quantity || !productCode) continue;

        const stock = await prisma.stock.findUnique({
          where: { faultId },
        });

        if (stock) {
          if (shipmentQty < quantity) {
            // Update stock inventory
            await prisma.stock.update({
              where: { id: stock.id },
              data: {
                inventory: stock.inventory ? stock.inventory - shipmentQty : 0,
              },
            });
          } else {
            // Delete stock if shipmentQty >= quantity
            await prisma.stock.delete({
              where: { id: stock.id },
            });
          }
        }
      }
    }

    return NextResponse.json(invoice, { status: 200 });
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

//Delete Invoice
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedInvoice = await prisma.invoice.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(deletedInvoice, { status: 200 });
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
