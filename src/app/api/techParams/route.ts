import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { hash } from 'bcryptjs';
import { checkUserRole } from 'utils/auth';
import { Prisma, Process } from '@prisma/client';

//All TechParams
export async function GET(req: NextRequest) {
  try {
    const techParams = await prisma.technicalParameter.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });

    return NextResponse.json(techParams, { status: 200 });
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

// Create  TechParams
export async function PUT(req: Request) {
  try {
    const reqBody: any = await req.json();

    const { machineId, processId } = reqBody;
    if (!machineId) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const techParams = await prisma.technicalParameter.create({
      data: reqBody,
    });

    //Update process when tech Params is added
    const process: Process = await prisma.process.findUnique({
      where: { id: processId },
    });
    if (process && process.status === 'PENDING') {
      const updatedProcess = await prisma.process.update({
        where: {
          id: process.id,
        },
        data: {
          ...process,
          status: 'PROCESSING',
        },
      });
    }

    const techParamsData = await prisma.technicalParameter.findMany({
      where: { processId },
      orderBy: [{ createdAt: 'asc' }],
    });
    return NextResponse.json(techParamsData, { status: 200 });
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
