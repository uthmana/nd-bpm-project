import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Fault, FaultControl } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//Get single Fault Control
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const faultControl: FaultControl = await prisma.faultControl.findFirst({
      where: { faultId: id },
    });
    if (!faultControl) {
      return NextResponse.json([], { status: 200 });
    }
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

//Update FaultControl
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const data: FaultControl = await req.json();
    const { faultId, result: controlReult } = data;

    const faultControl: FaultControl = await prisma.faultControl.findUnique({
      where: { id },
    });

    if (!faultControl) {
      return NextResponse.json(
        { message: 'Content not found' },
        { status: 401 },
      );
    }

    const updateFaultControl = await prisma.faultControl.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
      include: {
        Fault: {
          include: { customer: true },
        },
      },
    });

    const faultControlAccepted =
      controlReult === 'ACCEPT' ||
      controlReult === 'ACCEPTANCE_WITH_CONDITION' ||
      controlReult === 'PRE_PROCESS';

    const updateFault: Fault = await prisma.fault.update({
      where: {
        id: faultId,
      },
      data: {
        status: faultControlAccepted
          ? 'PROSES_BEKLENIYOR'
          : 'GIRIS_KONTROL_RET',
      },
    });

    return NextResponse.json(updateFaultControl, { status: 200 });
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

//Delete Fault Control
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedFault = await prisma.faultControl.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json([deletedFault], { status: 200 });
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
