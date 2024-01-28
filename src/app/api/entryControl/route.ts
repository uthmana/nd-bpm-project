import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { $Enums, FaultControl, Prisma } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

//All Faults
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const fault = await prisma.fault.findMany({ where: { status: 'PENDING' } });
    if (!fault) {
      throw new Error('No fault found');
    }
    return NextResponse.json(fault, { status: 200 });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientRustPanicError
    ) {
      return NextResponse.json(e, { status: 403 });
    }
    return NextResponse.json(e, { status: 500 });
  }
}

// Create Fault Control
export async function PUT(req: Request) {
  try {
    //TODO: restrict unathorized user : only super and admin allowed
    const allowedRoles = ['SUPER', 'ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
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

    const updateFault = await prisma.fault.update({
      where: {
        id: faultId,
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
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientRustPanicError
    ) {
      return NextResponse.json(e, { status: 403 });
    }
    return NextResponse.json(e, { status: 500 });
  }
}
