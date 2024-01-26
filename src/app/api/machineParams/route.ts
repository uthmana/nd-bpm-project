import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { checkUserRole } from 'utils/auth';
import { MachineParams } from '@prisma/client';

//All  MachineParams
export async function GET(req: NextRequest) {
  try {
    const machineParams = await prisma.machineParams.findMany();
    if (!machineParams) {
      throw new Error('machineParams not found');
    }
    return NextResponse.json(machineParams, { status: 200 });
  } catch (error) {
    console.error('Error fetching machineParams:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

// Create  machine
export async function PUT(req: Request) {
  try {
    const reqBody: any = await req.json();
    //TODO: validate reqBody
    const { param_name } = reqBody;
    if (!param_name) {
      throw new Error('Missing required field');
    }
    const machineParams = await prisma.machineParams.create({
      data: reqBody,
    });

    if (!machineParams) {
      throw new Error(' machineParams not found');
    }
    return NextResponse.json(machineParams, { status: 200 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Error ocured while creating machineParams' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
