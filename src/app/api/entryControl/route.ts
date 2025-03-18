import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { FaultControl } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//All Faults
export async function GET(req: NextRequest) {
  try {
    const fault = await prisma.fault.findMany({ where: { status: 'PENDING' } });
    return NextResponse.json(fault, { status: 200 });
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

// Create Fault Control
export async function PUT(req: Request) {
  try {
    const result: FaultControl | any = await req.json();
    const { faultId, result: controlReult } = result;

    if (!faultId || !controlReult) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const faultControlAccepted =
      controlReult === 'ACCEPT' ||
      controlReult === 'ACCEPTANCE_WITH_CONDITION' ||
      controlReult === 'PRE_PROCESS';

    const faultControlData = { ...result };
    delete faultControlData.faultId;

    const faultControl = await prisma.faultControl.create({
      data: {
        ...faultControlData,
        Fault: { connect: { id: faultId } },
      },
      include: {
        Fault: {
          include: { customer: true },
        },
      },
    });

    const updateFault = await prisma.fault.update({
      where: {
        id: faultId,
      },
      data: {
        status: faultControlAccepted ? 'PROSES_BEKLIYOR' : 'GIRIS_KONTROL_RET',
      },
    });

    return NextResponse.json(faultControl, { status: 200 });
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
