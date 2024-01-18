import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { $Enums, Fault, FaultControl, Process } from '@prisma/client';

//Get single Fault Control
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const faultControl: FaultControl = await prisma.faultControl.findFirst({
      where: { faultId: id },
    });
    if (!faultControl) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(faultControl, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Update FaultControl
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const data: FaultControl = await req.json();
    const { faultId, result } = data;

    if (!faultId) {
      throw new Error('You are missing a required data');
    }

    const faultControl: FaultControl = await prisma.faultControl.findUnique({
      where: { id },
    });

    if (!faultControl) {
      return NextResponse.json(
        { message: 'Fault Control not found.' },
        { status: 404 },
      );
    }

    const updateFaultControl = await prisma.faultControl.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });
    if (!updateFaultControl) {
      return NextResponse.json(
        { error: 'Error occuired while updating fault' },
        { status: 401 },
      );
    }

    const updateFault: Fault = await prisma.fault.update({
      where: {
        id: faultId,
      },
      data: { status: result },
    });

    //Create Process starts
    if (result !== 'ACCEPT') {
      const processData: Process = await prisma.process.findFirst({
        where: { faultId },
      });
      if (processData) {
        const processDel = await prisma.process.delete({
          where: { id: processData.id },
        });
      }
    }
    if (result === 'ACCEPT') {
      const processData: Process = await prisma.process.findFirst({
        where: { faultId },
      });

      if (!processData && updateFault) {
        const {
          id,
          customerName,
          product,
          quantity,
          productCode,
          application,
          standard,
          color,
        } = updateFault;
        const processCreate = await prisma.process.create({
          data: {
            faultId: id,
            customerName,
            product,
            quantity,
            productCode,
            application,
            standard,
            color,
          },
        });
      } else {
        if (updateFault) {
          const {
            id,
            customerName,
            product,
            quantity,
            productCode,
            application,
            standard,
            color,
          } = updateFault;

          const processUpdate = await prisma.process.update({
            where: { id: processData.id },
            data: {
              faultId: id,
              customerName,
              product,
              quantity,
              productCode,
              application,
              standard,
              color,
            },
          });
        }
      }
    }
    //Create Process ends
    if (!updateFault) {
      return NextResponse.json(
        { error: 'Error occuired while updating fault' },
        { status: 401 },
      );
    }

    return NextResponse.json(updateFaultControl, { status: 200 });
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
    const deletedFault = await prisma.faultControl.delete({
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
    return NextResponse.json([deletedFault], { status: 200 });
  } catch (error) {
    console.error('Internal Server Error', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
