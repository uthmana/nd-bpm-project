import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { FaultControl } from '@prisma/client';

//All Faults
export async function GET(req: NextRequest) {
  try {
    const fault = await prisma.fault.findMany({ where: { status: 'PENDING' } });
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

// Create Fault Control
export async function PUT(req: Request) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed

    const result: FaultControl = await req.json();
    const { faultId, result: controlReult, traceabilityCode } = result;

    if (!faultId) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const faultControl = await prisma.faultControl.create({
      data: result,
    });
    if (!faultControl) {
      throw new Error('Error occuried while creating form control');
    }

    const updateFault = await prisma.fault.update({
      where: {
        id: faultId,
        traceabilityCode,
      },
      data: { status: controlReult },
    });

    if (controlReult === 'ACCEPT') {
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
          technicalDrawingAttachment,
        } = updateFault;
        const process = await prisma.process.create({
          data: {
            faultId: id,
            customerName,
            product,
            quantity,
            productCode,
            application,
            standard,
            color,
            technicalDrawingAttachment,
          },
        });
      }
    }

    //Create Notification
    const notification = await prisma.notification.create({
      data: {
        title: 'Ürün Giriş Kontrolü',
        description: `${faultControl.product},${faultControl.plating},${faultControl.result},${faultControl.remarks}`,
        receiver: 'TECH',
        link: `/admin/entry?q=${faultControl?.productCode
          ?.toLocaleLowerCase()
          .replaceAll(' ', '%20')}`,
      },
    });

    return NextResponse.json(faultControl, { status: 200 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Error ocured while creating fault control' },
        { status: 404 },
      );
    }
    return NextResponse.json({
      error: 'Error ocured while creating fault control',
    });
  }
}
