import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { Prisma, Process } from '@prisma/client';

//Get single  Process
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const process: Process = await prisma.process.findUnique({
      where: { id: id },
      include: {
        technicalParams: true,
        finalControl: true,
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

    return NextResponse.json({ ...process, machineParams }, { status: 200 });
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
          title: 'Proses Kontrolü',
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

    //Delete all relatated techParams
    // const { machineId } = deletedProcess;
    // const deletedProcessTechParams = await prisma.technicalParameter.findMany({
    //   where: {
    //     machineId,
    //   },
    // });
    // if (deletedProcessTechParams) {
    //   const techParamIds = deletedProcessTechParams.map((item) => {
    //     return item.id;
    //   });
    //   if (techParamIds?.length > 0) {
    //     const deletedTechParams = await prisma.technicalParameter.deleteMany({
    //       where: {
    //         id: {
    //           in: techParamIds,
    //         },
    //         machineId,
    //       },
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
