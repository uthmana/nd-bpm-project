import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { Machine, MachineParams } from '@prisma/client';

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
    if (!machine) {
      throw new Error('machine not found');
    }
    return NextResponse.json(machine, { status: 200 });
  } catch (error) {
    console.error('Error fetching machine:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Update  machine
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: any = await req.json();
    //TODO: validate reqBody
    const { machine_Name, params } = result;

    if (!machine_Name) {
      throw new Error('You are missing a required data');
    }

    const machine: Machine = await prisma.machine.findUnique({
      where: { id },
    });

    if (!machine) {
      return NextResponse.json(
        { message: 'machine not found.' },
        { status: 404 },
      );
    }

    const updatedMachine = await prisma.machine.update({
      where: {
        id: id,
      },
      data: { machine_Name },
    });
    if (!updatedMachine) {
      return NextResponse.json(
        { error: 'Error occuired while updating Machine' },
        { status: 401 },
      );
    }

    //delete and create machine params
    const machineParams: any = await prisma.machineParams.findMany({
      where: { machineId: id },
    });

    if (machineParams && machineParams?.length > 0) {
      const machineParamsIds = machineParams.map((item) => item.id);
      const machineParamsDeleted: any = await prisma.machineParams.deleteMany({
        where: {
          id: {
            in: machineParamsIds,
          },
        },
      });

      if (machineParamsDeleted) {
        const machineParamsData = params.map((item) => {
          return { machineId: machine.id, param_name: item.param_name };
        });
        const machineParams = await prisma.machineParams.createMany({
          data: machineParamsData,
        });
      }
    }

    return NextResponse.json(updatedMachine, { status: 200 });
  } catch (error) {
    console.error('Error updating Machine', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Delete  machine
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedmachine = await prisma.machine.delete({
      where: {
        id: id,
      },
    });
    if (!deletedmachine) {
      return NextResponse.json(
        { error: 'Error occuired while deleting machine' },
        { status: 401 },
      );
    }

    return NextResponse.json(deletedmachine, { status: 200 });
  } catch (error) {
    console.error('Internal Server Error', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
