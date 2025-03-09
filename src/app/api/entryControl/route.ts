import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { FaultControl, Prisma } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

//All Faults
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ message: 'Access forbidden', status: 403 });
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
    const result: FaultControl | any = await req.json();
    const { faultId, result: controlReult } = result;

    if (!faultId || !controlReult) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const faultControlAccepted =
      controlReult === 'ACCEPT' ||
      controlReult === 'ACCEPTANCE_WITH_CONDITION' ||
      controlReult === 'PRE_PROCESS';

    const faultControlData = { ...result };
    delete faultControlData.faultId;

    const faultControl = await prisma.faultControl.create({
      data: {
        ...faultControlData,
        Fault: { connect: { id: faultId } },
      },
    });

    const updateFault = await prisma.fault.update({
      where: {
        id: faultId,
      },
      data: {
        status: faultControlAccepted ? 'PROSES_BEKLIYOR' : 'GIRIS_KONTROL_RET',
      },
    });

    return NextResponse.json(faultControl, { status: 200 });
  } catch (e) {
    console.log(e);
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
