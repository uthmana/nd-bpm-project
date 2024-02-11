import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { hash } from 'bcryptjs';
import { checkUserRole } from 'utils/auth';
import { Machine, MachineParams, Prisma, Process, User } from '@prisma/client';

//All  machine
export async function GET(req: NextRequest) {
  try {
    const machine = await prisma.machine.findMany({
      include: { machineParams: true },
    });
    if (!machine) {
      throw new Error('User not found');
    }
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

// Create  machine
export async function PUT(req: Request) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ message: 'Access forbidden', status: 403 });
    }
    const reqBody: any = await req.json();
    //TODO: validate reqBody
    const { machine: machineData, params } = reqBody;
    if (!machineData.machine_Name) {
      throw new Error('Missing required field');
    }
    const machine = await prisma.machine.create({
      data: machineData,
    });

    if (!machine) {
      throw new Error('machine not found');
    }

    const machineParamsData = params.map((item) => {
      return { machineId: machine.id, param_name: item.param_name };
    });

    const machineParams = await prisma.machineParams.createMany({
      data: machineParamsData,
    });

    return NextResponse.json(machineParams, { status: 200 });
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
