import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { FinalControl } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//All Final Control
export async function GET(req: NextRequest) {
  try {
    const finalControl = await prisma.finalControl.findMany();
    return NextResponse.json(finalControl, { status: 200 });
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

// Create Final Control
export async function PUT(req: Request) {
  try {
    const result: FinalControl | any = await req.json();
    const { faultId, result: controlReult } = result;

    if (!faultId || !controlReult) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const { testItem, testArea, faultId: _faultId, ...rest } = result;
    const finalControlData = { ...rest };

    const finalControl = await prisma.finalControl.create({
      data: {
        ...finalControlData,
        ...(testItem.length > 0 ? { testItem: { create: testItem } } : {}),
        ...(testArea.length > 0 ? { testArea: { create: testArea } } : {}),
        Fault: { connect: { id: faultId } },
      },
    });

    if (finalControl) {
      const updateFault = await prisma.fault.update({
        where: {
          id: faultId,
        },
        data: {
          shipmentQty: finalControl.nakliye_miktar,
          status:
            controlReult !== 'REJECT'
              ? 'IRSALIYE_KESIMI_BEKLIYOR'
              : 'FINAL_KONTROL_RET',
        },
      });
    }

    return NextResponse.json(finalControl, { status: 200 });
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
