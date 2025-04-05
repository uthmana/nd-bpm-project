import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { MachineParams } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//Get single  MachineParams
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const machineParams: MachineParams = await prisma.machineParams.findUnique({
      where: { id: id },
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

//Update  MachineParams
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: MachineParams = await req.json();
    const { param_name } = result;

    if (!param_name) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const machineParams: MachineParams = await prisma.machineParams.findUnique({
      where: { id },
    });

    const updatedMachineParams = await prisma.machineParams.update({
      where: {
        id: id,
      },
      data: {
        ...result,
      },
    });

    return NextResponse.json(updatedMachineParams, { status: 200 });
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

//Delete  machineParams
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const id = route.params.id;
    const deletedMachineParams = await prisma.machineParams.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(deletedMachineParams, { status: 200 });
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
