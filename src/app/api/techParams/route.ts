import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Process } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//All TechParams
export async function GET(req: NextRequest) {
  try {
    const techParams = await prisma.technicalParameter.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });

    return NextResponse.json(techParams, { status: 200 });
  } catch (e) {
    console.error('Prisma Error:', e);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      {
        error: userMessage,
        details: technicalMessage,
      },
      { status: 500 },
    );
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
    console.error('Prisma Error:', e);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      {
        error: userMessage,
        details: technicalMessage,
      },
      { status: 500 },
    );
  }
}
