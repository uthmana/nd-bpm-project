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
    const { faultId, result: controlReult } = result;

    if (!faultId || !controlReult) {
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

    //Create Process when faultControl is accepted
    if (
      controlReult === 'ACCEPT' ||
      controlReult === 'ACCEPTANCE_WITH_CONDITION'
    ) {
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
        description: `Yeni bir ürün Giriş Kontrolü yapıldı.`,
        receiver: 'TECH',
        link: `/admin/entry/${faultControl?.faultId}`,
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
