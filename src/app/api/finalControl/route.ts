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
    const allowedRoles = ['NORMAL', 'ADMIN', 'SUPER', 'TECH'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }

    const result: FinalControl | any = await req.json();
    const { faultId, result: controlReult } = result;

    if (!faultId || !controlReult) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const { testItem, testArea, faultId: _faultId, ...rest } = result;
    const finalControlData = { ...rest };

    const finalControl = await prisma.finalControl.create({
      data: {
        ...finalControlData,
        ...(testItem.length > 0 ? { testItem: { create: testItem } } : {}),
        ...(testArea.length > 0 ? { testArea: { create: testArea } } : {}),
        Fault: { connect: { id: faultId } },
      },
    });

    if (finalControl) {
      const updateFault = await prisma.fault.update({
        where: {
          id: faultId,
        },
        data: {
          shipmentQty: finalControl.nakliye_miktar,
          status:
            controlReult !== 'REJECT'
              ? 'IRSALIYE_KESIMI_BEKLIYOR'
              : 'FINAL_KONTROL_RET',
        },
      });
    }

    return NextResponse.json(finalControl, { status: 200 });
  } catch (e) {
    console.log(e);
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
