import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { Process } from '@prisma/client';

//Get single  Process
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const process: Process = await prisma.process.findUnique({
      where: { id: id },
      include: {
        technicalParams: true,
      },
    });
    if (!process) {
      throw new Error('Fault not found');
    }

    let machineParams = [];
    const { machineId } = process;
    if (machineId) {
      const machines: any = await prisma.machine.findUnique({
        where: { id: machineId },
        include: { machineParams: true },
      });
      if (machines) {
        machineParams = machines?.machineParams;
      }
    }

    return NextResponse.json({ ...process, machineParams }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
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
      throw new Error('You are missing a required data');
    }

    const process: Process = await prisma.process.findUnique({
      where: { id },
    });

    if (!process) {
      return NextResponse.json(
        { message: 'Fault not found.' },
        { status: 404 },
      );
    }

    const updatedProcess = await prisma.process.update({
      where: {
        id: id,
      },
      data: {
        ...result,
      },
    });
    if (!updatedProcess) {
      return NextResponse.json(
        { error: 'Error occuired while updating fault' },
        { status: 401 },
      );
    }
    return NextResponse.json(updatedProcess, { status: 200 });
  } catch (error) {
    console.error('Error updating fault', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Delete  Process
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedProcess = await prisma.process.delete({
      where: {
        id: id,
      },
    });
    if (!deletedProcess) {
      return NextResponse.json(
        { error: 'Error occuired while deleting fault' },
        { status: 401 },
      );
    }

    return NextResponse.json(deletedProcess, { status: 200 });
  } catch (error) {
    console.error('Internal Server Error', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
