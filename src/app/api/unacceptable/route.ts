import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Unacceptable } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//All unacceptableStage
export async function GET(req: NextRequest) {
  try {
    const unacceptable = await prisma.unacceptable.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(unacceptable, { status: 200 });
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

// Create unacceptableStage
export async function PUT(req: NextRequest) {
  try {
    const unacceptable: Unacceptable | any = await req.json();
    const { unacceptableStage, faultId } = unacceptable;

    if (!unacceptableStage || !faultId) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const unacceptableData = { ...unacceptable };
    delete unacceptableData.faultId;
    const unacceptableStageItem = await prisma.unacceptable.create({
      data: {
        ...unacceptableData,
        Fault: { connect: { id: faultId } },
      },
    });
    return NextResponse.json(unacceptableStageItem, { status: 200 });
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
