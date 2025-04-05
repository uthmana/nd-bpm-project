import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Machine } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//Get single  machine
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const machine: Machine = await prisma.machine.findUnique({
      where: { id: id },
      include: {
        machineParams: true,
      },
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

//Update  machine
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: any = await req.json();
    const { machine_Name, id: machineId } = result;

    if (!machineId || !machine_Name) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const machine: Machine = await prisma.machine.findUnique({
      where: { id },
    });

    const updatedMachine = await prisma.machine.update({
      where: {
        id: id,
      },
      data: { machine_Name },
    });

    return NextResponse.json(updatedMachine, { status: 200 });
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

//Delete  machine
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const id = route.params.id;
    const deletedmachine = await prisma.machine.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(deletedmachine, { status: 200 });
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
