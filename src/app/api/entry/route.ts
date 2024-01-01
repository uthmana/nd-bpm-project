import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Fault } from '@prisma/client';

//All Faults
export async function GET(req: NextRequest) {
  try {
    const fault = await prisma.fault.findMany();
    if (!fault) {
      throw new Error('No fault found');
    }
    return NextResponse.json(fault, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// Create Fault
export async function PUT(req: Request) {
  try {
    const result: Fault = await req.json();
    const { traceabilityCode } = result;

    if (!traceabilityCode) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const fault = await prisma.fault.create({
      data: result,
    });
    if (!fault) {
      throw new Error('No fault found');
    }

    //Create Notification
    const notification = await prisma.notification.create({
      data: {
        title: 'Ürün Girişi',
        description: `${fault.product},${fault.application},${fault.standard},${fault.color}`,
        receiver: 'SUPER',
        link: `/admin/entry?q=${fault.product}`,
      },
    });

    return NextResponse.json({ fault }, { status: 200 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Error ocured while creating fault' },
        { status: 404 },
      );
    }
    return NextResponse.json({ error: 'Error ocured while creating fault' });
  }
}
