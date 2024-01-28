import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { checkUserRole } from 'utils/auth';
import { MachineParams, Prisma } from '@prisma/client';

//All  MachineParams
export async function GET(req: NextRequest) {
  try {
    const machineParams = await prisma.machineParams.findMany();
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
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }
    const machineParams = await prisma.machineParams.create({
      data: reqBody,
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
