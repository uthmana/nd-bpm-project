import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Process } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//All  Process
export async function GET(req: NextRequest) {
  try {
    const processnew = await prisma.$transaction(async (trans) => {
      const faultsIds = (
        await trans.faultControl.findMany({ select: { id: true } })
      ).map((fault) => fault.id);

      const processes = await trans.process.findMany({
        include: { technicalParams: true },
        orderBy: { createdAt: 'desc' },
      });

      const faultResources = await trans.faultControl.findMany({
        where: {
          id: { in: faultsIds },
        },
      });

      const mergedData = processes.map((p) => ({
        ...p,
        newtechparam: p.technicalDrawingAttachment.concat(
          ';',
          faultResources.find((f) => f.faultId === p.faultId).image,
        ),
      }));
      return mergedData;
    });

    return NextResponse.json(processnew, { status: 200 });
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

// Create  Process
export async function PUT(req: Request) {
  try {
    const reqBody: Process | any = await req.json();
    const processData = { ...reqBody };

    const newProcess = await prisma.process.create({
      data: {
        ...processData,
        machine: { connect: { id: reqBody.machineId } },
      },
    });

    const updatedMachine = await prisma.machine.update({
      where: { id: reqBody.machineId },
      data: {
        processId: newProcess.id,
      },
    });

    const updatedFault = await prisma.fault.update({
      where: { id: reqBody.faultId },
      data: {
        status: 'PROSES_ISLENIYOR',
      },
    });

    return NextResponse.json(newProcess, { status: 200 });
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
