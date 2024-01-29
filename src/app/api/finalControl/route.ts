import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { FinalControl, Prisma } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

//All Final Control
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['SUPER', 'ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
    const finalControl = await prisma.finalControl.findMany();

    return NextResponse.json(finalControl, { status: 200 });
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

// Create Final Control
export async function PUT(req: Request) {
  try {
    //TODO: restrict unathorized user : only super and admin allowed
    const allowedRoles = ['SUPER', 'ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
    const result: FinalControl = await req.json();
    const { faultId, result: controlReult, processId } = result;

    if (!faultId || !controlReult || !processId) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }
    const finalControl = await prisma.finalControl.create({
      data: result,
    });

    //Create Notification
    const notification = await prisma.notification.create({
      data: {
        title: 'Ürün Final Kontrolü',
        description: 'Yeni bir ürün final kontrolu yapıldı',
        receiver: 'OTHER',
        link: `/admin/process/control/${finalControl.id}`,
      },
    });

    return NextResponse.json(finalControl, { status: 200 });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientRustPanicError
    ) {
      console.log({ e });
      return NextResponse.json(e, { status: 403 });
    }
    return NextResponse.json(e, { status: 500 });
  }
}
