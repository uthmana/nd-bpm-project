import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { hash } from 'bcryptjs';
import { checkUserRole } from 'utils/auth';
import { Process } from '@prisma/client';

//All TechParams
export async function GET(req: NextRequest) {
  try {
    const techParams = await prisma.technicalParameter.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });
    if (!techParams) {
      throw new Error('User not found');
    }
    return NextResponse.json(techParams, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

// Create  TechParams
export async function PUT(req: Request) {
  try {
    const reqBody: Process = await req.json();
    //TODO: validate reqBody

    const { machineId } = reqBody;
    if (!machineId) {
      throw new Error('You are missing a required feild');
    }

    const techParams = await prisma.technicalParameter.create({
      data: reqBody,
    });

    if (!techParams) {
      throw new Error('Process not found');
    }

    //Update process when tech Params is added
    const process: Process = await prisma.process.findUnique({
      where: { machineId },
    });
    if (process && process.status === 'PENDING') {
      const updatedProcess = await prisma.process.update({
        where: {
          id: process.id,
        },
        data: {
          ...process,
          status: 'PROCESSING',
        },
      });
    }

    const techParamsData = await prisma.technicalParameter.findMany({
      where: { machineId: techParams.machineId },
      orderBy: [{ createdAt: 'asc' }],
    });
    return NextResponse.json(techParamsData, { status: 200 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Error ocured while creating process' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
