import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Fault, Prisma } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

//All Faults
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['NORMAL', 'ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const fault = await prisma.fault.findMany({
      include: { faultControl: true },
    });

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

// Create Fault
export async function PUT(req: Request) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const allowedRoles = ['NORMAL', 'ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
    const result: Fault = await req.json();
    const { customerName, productCode, quantity, application } = result;

    if (!customerName || !productCode || !quantity || !application) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const fault = await prisma.fault.create({
      data: result,
    });

    //Create Notification
    const notification = await prisma.notification.create({
      data: {
        title: 'Ürün Girişi',
        description: `Yeni ürün girişi yapıldı.`,
        receiver: 'SUPER',
        link: `/admin/entry/${fault.id}`,
      },
    });

    return NextResponse.json({ fault }, { status: 200 });
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
