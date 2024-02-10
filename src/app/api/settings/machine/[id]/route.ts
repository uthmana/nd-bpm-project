import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { Machine, MachineParams, Prisma } from '@prisma/client';

//Get single  machine
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const machine: Machine = await prisma.machine.findUnique({
      where: { id: id },
      include: {
        machineParams: true,
      },
    });
    return NextResponse.json(machine, { status: 200 });
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

//Update  machine
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: any = await req.json();
    //TODO: validate reqBody
    const { machine_Name, id: machineId } = result;

    if (!machineId || !machine_Name) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const machine: Machine = await prisma.machine.findUnique({
      where: { id },
    });

    const updatedMachine = await prisma.machine.update({
      where: {
        id: id,
      },
      data: { machine_Name },
    });

    //delete and create machine params
    // const machineParams: any = await prisma.machineParams.findMany({
    //   where: { machineId: id },
    // });

    // if (machineParams && machineParams?.length > 0) {
    //   const machineParamsIds = machineParams.map((item) => item.id);
    //   const machineParamsDeleted: any = await prisma.machineParams.deleteMany({
    //     where: {
    //       id: {
    //         in: machineParamsIds,
    //       },
    //     },
    //   });

    //   if (machineParamsDeleted) {
    //     const machineParamsData = params.map((item) => {
    //       return { machineId: machine.id, param_name: item.param_name };
    //     });
    //     const machineParams = await prisma.machineParams.createMany({
    //       data: machineParamsData,
    //     });
    //   }
    // }

    return NextResponse.json(updatedMachine, { status: 200 });
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

//Delete  machine
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedmachine = await prisma.machine.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(deletedmachine, { status: 200 });
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
