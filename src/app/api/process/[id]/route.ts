import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { Fault, Prisma, Process, Stock } from '@prisma/client';
import { filterObject } from 'utils';

//Get single  Process
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const process: Process = await prisma.process.findUnique({
      where: { id: id },
      include: {
        technicalParams: true,
        finalControl: {
          include: { testItem: true },
        },
        unacceptable: true,
      },
    });

    let machineParams = [];
    const { machineId } = process;
    if (machineId) {
      const machines: any = await prisma.machine.findUnique({
        where: { id: machineId },
        include: { machineParams: true },
      });
      if (machines) {
        machineParams = machines?.machineParams;
      }
    }

    const fault: Fault | any = await prisma.fault.findUnique({
      where: { id: process.faultId },
      select: {
        defaultTechParameter: true,
      },
    });

    //Set defaultTechParam
    let defaultTechParam = {};
    if (fault) {
      const {
        createdAt,
        createdBy,
        faultId,
        id,
        machineId,
        processId,
        updatedAt,
        updatedBy,
        ...defaultTechParameter
      } = fault?.defaultTechParameter[0];
      if (defaultTechParameter) {
        defaultTechParam = filterObject(defaultTechParameter);
      }
    }

    return NextResponse.json(
      { ...process, machineParams, defaultTechParam },
      { status: 200 },
    );
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

//Update  Process
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: Process = await req.json();
    //TODO: validate reqBody
    const { faultId } = result;

    if (!faultId) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const process: Process = await prisma.process.findUnique({
      where: { id },
    });

    const updatedProcess = await prisma.process.update({
      where: {
        id: id,
      },
      data: {
        ...result,
      },
    });

    //Send Process complete Notification
    if (result.status === 'FINISHED') {
      const notification = await prisma.notification.create({
        data: {
          title: 'Ürün Final Kontrolü',
          description: `${updatedProcess?.product} ürünün prosesi tamamalandı.`,
          receiver: 'SUPER',
          link: `/admin/process/${id}`,
        },
      });
    }

    return NextResponse.json(updatedProcess, { status: 200 });
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

//Delete  Process
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedProcess = await prisma.process.delete({
      where: {
        id: id,
      },
    });

    if (deletedProcess) {
      //Tracking stock
      const stock: Stock = await prisma.stock.findUnique({
        where: { id },
      });
      if (stock) {
        const updateStock = await prisma.stock.update({
          where: {
            faultId: deletedProcess.faultId,
          },
          data: { faultId: null },
        });
      }
    }

    return NextResponse.json(deletedProcess, { status: 200 });
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
