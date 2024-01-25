import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { MachineParams } from '@prisma/client';

//Get single  MachineParams
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const machineParams: MachineParams = await prisma.machineParams.findUnique({
      where: { id: id },
    });
    if (!machineParams) {
      throw new Error('MachineParams not found');
    }
    return NextResponse.json(machineParams, { status: 200 });
  } catch (error) {
    console.error('Error fetching MachineParams:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Update  MachineParams
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: MachineParams = await req.json();
    //TODO: validate reqBody
    const { param_name } = result;

    if (!param_name) {
      throw new Error('You are missing a required data');
    }

    const machineParams: MachineParams = await prisma.machineParams.findUnique({
      where: { id },
    });

    if (!machineParams) {
      return NextResponse.json(
        { message: 'MachineParams not found.' },
        { status: 404 },
      );
    }

    const updatedMachineParams = await prisma.machineParams.update({
      where: {
        id: id,
      },
      data: {
        ...result,
      },
    });
    if (!updatedMachineParams) {
      return NextResponse.json(
        { error: 'Error occuired while updating MachineParams' },
        { status: 401 },
      );
    }
    return NextResponse.json(updatedMachineParams, { status: 200 });
  } catch (error) {
    console.error('Error updating Machine', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Delete  machineParams
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedMachineParams = await prisma.machineParams.delete({
      where: {
        id: id,
      },
    });
    if (!deletedMachineParams) {
      return NextResponse.json(
        { error: 'Error occuired while deleting MachineParams' },
        { status: 401 },
      );
    }

    return NextResponse.json(deletedMachineParams, { status: 200 });
  } catch (error) {
    console.error('Internal Server Error', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
