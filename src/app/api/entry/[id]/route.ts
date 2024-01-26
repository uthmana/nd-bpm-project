import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { Fault, Process } from '@prisma/client';

//Get single Fault
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const fault: Fault = await prisma.fault.findUnique({
      where: { id: id },
      include: { faultControl: true },
    });
    if (!fault) {
      throw new Error('Fault not found');
    }
    return NextResponse.json(fault, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Update Fault
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: Fault = await req.json();
    const { traceabilityCode } = result;

    if (!traceabilityCode) {
      throw new Error('You are missing a required data');
    }

    const fault: Fault = await prisma.fault.findUnique({
      where: { id },
    });

    if (!fault) {
      return NextResponse.json(
        { message: 'Fault not found.' },
        { status: 404 },
      );
    }

    const updateFault = await prisma.fault.update({
      where: {
        id: id,
      },
      data: {
        ...result,
      },
    });
    if (!updateFault) {
      return NextResponse.json(
        { error: 'Error occuired while updating fault' },
        { status: 401 },
      );
    }
    return NextResponse.json(updateFault, { status: 200 });
  } catch (error) {
    console.error('Error updating fault', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Delete Fault
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedFault = await prisma.fault.delete({
      where: {
        id: id,
      },
    });

    if (!deletedFault) {
      return NextResponse.json(
        { error: 'Error occuired while deleting fault' },
        { status: 401 },
      );
    }
    //Delete related faultcontrol
    const deletedFaultControl = await prisma.faultControl.findFirst({
      where: {
        faultId: deletedFault.id,
      },
    });
    if (deletedFaultControl) {
      const _deletedFaultControl = await prisma.faultControl.delete({
        where: {
          id: deletedFaultControl.id,
        },
      });
    }

    return NextResponse.json([deletedFault], { status: 200 });
  } catch (error) {
    console.error('Internal Server Error', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
