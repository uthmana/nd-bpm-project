import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//All  MachineParams
export async function GET(req: NextRequest) {
  try {
    const machineParams = await prisma.machineParams.findMany();
    return NextResponse.json(machineParams, { status: 200 });
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
