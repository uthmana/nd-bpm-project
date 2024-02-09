import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { FinalControl, Prisma } from '@prisma/client';

//Get single FaultControl
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const finalControl: FinalControl = await prisma.finalControl.findFirst({
      where: { id },
    });
    if (!finalControl) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(finalControl, { status: 200 });
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

//Update FinalControl
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const data: FinalControl = await req.json();
    const { faultId, result, processId } = data;

    if (!faultId || !result || !processId) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const finalControl: FinalControl = await prisma.finalControl.findUnique({
      where: { id },
    });

    const updateFinalControl = await prisma.finalControl.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });

    // Update Invoice and Process
    if (result === 'REJECT') {
      const updatedProcess = await prisma.process.update({
        where: {
          id: processId,
        },
        data: { invoiceId: null },
      });
    }

    if (result === 'ACCEPT') {
      const invoice = await prisma.invoice.findUnique({
        where: { customerId: id },
      });
      if (invoice) {
        const updatedProcess = await prisma.process.update({
          where: {
            id: processId,
          },
          data: { invoiceId: invoice.id },
        });

        return NextResponse.json(updateFinalControl, { status: 200 });
      }

      const stock = await prisma.stock.findUnique({
        where: { faultId },
        include: { customer: true },
      });
      if (stock) {
        const { customer } = stock;
        const { id, tax_Office, taxNo, rep_name, address } = customer;
        const invoice = await prisma.invoice.create({
          data: {
            invoiceDate: new Date(),
            customerId: id,
            tax_Office,
            taxNo,
            rep_name,
            address,
          },
        });
        if (invoice) {
          const updatedProcess = await prisma.process.update({
            where: {
              id: processId,
            },
            data: { invoiceId: invoice.id },
          });
        }
      }
    }

    return NextResponse.json(updateFinalControl, { status: 200 });
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

//Delete FinalControl
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedFinalControl = await prisma.finalControl.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(deletedFinalControl, { status: 200 });
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
