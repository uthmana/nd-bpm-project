import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//All  machine
export async function GET(req: NextRequest) {
  try {
    const machine = await prisma.machine.findMany({
      include: { machineParams: true },
    });

    return NextResponse.json(machine, { status: 200 });
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
    const { machine: machineData, params } = reqBody;
    if (!machineData.machine_Name) {
      throw new Error('Missing required field');
    }
    const machine = await prisma.machine.create({
      data: machineData,
    });

    const machineParamsData = params.map((item) => {
      return { machineId: machine.id, param_name: item.param_name };
    });

    const machineParams = await prisma.machineParams.createMany({
      data: machineParamsData,
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
