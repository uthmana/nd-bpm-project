import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Process } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//Get single  Process
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const process: Process = await prisma.process.findUnique({
      where: { id: id },
      include: {
        technicalParams: {
          orderBy: { createdAt: 'asc' },
        },
        machine: {
          include: {
            machineParams: true,
          },
        },
        Fault: {
          include: {
            defaultTechParameter: true,
            faultControl: true,
            customer: true,
          },
        },
      },
    });

    if (!process) {
      return NextResponse.json({ message: 'No such Process' }, { status: 401 });
    }

    return NextResponse.json(process, { status: 200 });
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

//Update  Process
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: Process = await req.json();
    //TODO: validate reqBody
    const { faultId } = result;

    if (!faultId) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const process: Process = await prisma.process.findUnique({
      where: { id },
    });

    if (!process) {
      return NextResponse.json({ message: 'No such process' }, { status: 401 });
    }

    const updatedProcess = await prisma.process.update({
      where: {
        id: id,
      },
      data: {
        ...result,
      },
    });

    if (result.status === 'FINISHED') {
      const updatedProcess = await prisma.fault.update({
        where: {
          id: result.faultId,
        },
        data: {
          status: 'FINAL_KONTROL_BEKLIYOR',
        },
      });
    }

    return NextResponse.json(updatedProcess, { status: 200 });
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

//Delete  Process
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const id = route.params.id;
    const deletedProcess = await prisma.process.delete({
      where: {
        id: id,
      },
    });

    const updatedFault = await prisma.fault.update({
      where: { id: deletedProcess.faultId },
      data: {
        status: 'PROSES_BEKLIYOR',
      },
    });

    return NextResponse.json(deletedProcess, { status: 200 });
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
