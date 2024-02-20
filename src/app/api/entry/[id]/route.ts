import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { Fault, Prisma, Process } from '@prisma/client';

//Get single Fault
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const fault: Fault = await prisma.fault.findUnique({
      where: { id: id },
      include: { faultControl: true },
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
    const { customerName, productCode, quantity, application } = result;

    if (!customerName || !productCode || !quantity || !application) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const fault: Fault = await prisma.fault.findUnique({
      where: { id },
    });

    const updateFault = await prisma.fault.update({
      where: {
        id: id,
      },
      data: {
        ...result,
      },
    });

    return NextResponse.json(updateFault, { status: 200 });
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

//Delete Fault
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedFault = await prisma.fault.delete({
      where: {
        id: id,
      },
    });

    //Tracking stock
    // if (deletedFault) {
    //   const updateStock = await prisma.stock.update({
    //     where: {
    //       id: deletedFault.stockId,
    //     },
    //     data: { faultId: null },
    //   });
    // }

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
