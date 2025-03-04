import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { Fault, Prisma, Process, Stock } from '@prisma/client';
import { filterObject } from 'utils';
import { checkUserRole } from 'utils/auth';

//Get single  Process
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['NORMAL', 'TECH', 'ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
    const id = route.params.id;
    const process: Process = await prisma.process.findUnique({
      where: { id: id },
      include: {
        technicalParams: true,
        machine: {
          include: {
            machineParams: true,
          },
        },
        Fault: {
          include: {
            defaultTechParameter: true,
          },
        },
      },
    });

    if (!process) {
      return NextResponse.json({ message: 'No such Process' }, { status: 401 });
    }

    // let machineParams = [];
    // const { machineId } = process;
    // if (machineId) {
    //   const machines: any = await prisma.machine.findUnique({
    //     where: { id: machineId },
    //     include: { machineParams: true },
    //   });
    //   if (machines) {
    //     machineParams = machines?.machineParams;
    //   }
    // }

    // const fault: Fault | any = await prisma.fault.findUnique({
    //   where: { id: process.faultId },
    //   select: {
    //     defaultTechParameter: true,
    //   },
    // });

    //Set defaultTechParam
    // let defaultTechParam = {};
    // if (fault) {
    //   const {
    //     createdAt,
    //     createdBy,
    //     faultId,
    //     id,
    //     machineId,
    //     processId,
    //     updatedAt,
    //     updatedBy,
    //     ...defaultTechParameter
    //   } = fault?.defaultTechParameter[0];
    //   if (defaultTechParameter) {
    //     defaultTechParam = filterObject(defaultTechParameter);
    //   }
    // }

    return NextResponse.json(process, { status: 200 });
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

    if (!process) {
      return NextResponse.json({ message: 'No such process' }, { status: 401 });
    }

    const updatedProcess = await prisma.process.update({
      where: {
        id: id,
      },
      data: {
        ...result,
      },
    });

    if (result.status === 'FINISHED') {
      const updatedProcess = await prisma.fault.update({
        where: {
          id: result.faultId,
        },
        data: {
          status: 'FINAL_KONTROL_BEKLIYOR',
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

    const updatedFault = await prisma.fault.update({
      where: { id: deletedProcess.faultId },
      data: {
        status: 'PROSES_BEKLIYOR',
      },
    });

    // if (deletedProcess) {
    //   //Tracking stock
    //   const stock: Stock = await prisma.stock.findUnique({
    //     where: { id },
    //   });
    //   if (stock) {
    //     const updateStock = await prisma.stock.update({
    //       where: {
    //         faultId: deletedProcess.faultId,
    //       },
    //       data: { faultId: null },
    //     });
    //   }
    // }

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
