import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { FinalControl } from '@prisma/client';

//Get single FaultControl
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const finalControl: FinalControl = await prisma.finalControl.findFirst({
      where: { id },
    });
    if (!finalControl) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(finalControl, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Update FinalControl
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const data: FinalControl = await req.json();
    const { faultId, result, processId } = data;

    if (!faultId || !result || !processId) {
      throw new Error('You are missing a required data');
    }

    const finalControl: FinalControl = await prisma.finalControl.findUnique({
      where: { id },
    });

    if (!finalControl) {
      return NextResponse.json(
        { message: 'Fault Control not found.' },
        { status: 404 },
      );
    }

    const updateFinalControl = await prisma.finalControl.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });
    if (!updateFinalControl) {
      return NextResponse.json(
        { error: 'Error occuired while updating fault' },
        { status: 401 },
      );
    }

    return NextResponse.json(updateFinalControl, { status: 200 });
  } catch (error) {
    console.error('Error updating fault', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Delete FinalControl
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedFinalControl = await prisma.finalControl.delete({
      where: {
        id: id,
      },
    });
    if (!deletedFinalControl) {
      return NextResponse.json(
        { error: 'Error occuired while deleting fault' },
        { status: 401 },
      );
    }
    return NextResponse.json(deletedFinalControl, { status: 200 });
  } catch (error) {
    console.error('Internal Server Error', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
