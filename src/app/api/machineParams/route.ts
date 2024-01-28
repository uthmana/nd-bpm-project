import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { checkUserRole } from 'utils/auth';
import { MachineParams, Prisma } from '@prisma/client';

//All  MachineParams
export async function GET(req: NextRequest) {
  try {
    const machineParams = await prisma.machineParams.findMany();
    if (!machineParams) {
      throw new Error('machineParams not found');
    }
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

// Create  machine
export async function PUT(req: Request) {
  try {
    const reqBody: any = await req.json();
    //TODO: validate reqBody
    const { param_name } = reqBody;
    if (!param_name) {
      throw new Error('Missing required field');
    }
    const machineParams = await prisma.machineParams.create({
      data: reqBody,
    });

    if (!machineParams) {
      throw new Error(' machineParams not found');
    }
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
