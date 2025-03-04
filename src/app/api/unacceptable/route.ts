import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { Prisma, Unacceptable } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

//All unacceptableStage
export async function GET(req: NextRequest) {
  const allowedRoles = ['NORMAL', 'ADMIN', 'SUPER'];
  const hasrole = await checkUserRole(allowedRoles);
  if (!hasrole) {
    return NextResponse.json({ message: 'Access forbidden' }, { status: 403 });
  }
  const unacceptable = await prisma.unacceptable.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(unacceptable, { status: 200 });
}

// Create unacceptableStage
export async function PUT(req: NextRequest) {
  try {
    const unacceptable: Unacceptable | any = await req.json();
    const { unacceptableStage, faultId } = unacceptable;

    if (!unacceptableStage || !faultId) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const unacceptableData = { ...unacceptable };
    delete unacceptableData.faultId;
    const unacceptableStageItem = await prisma.unacceptable.create({
      data: {
        ...unacceptableData,
        Fault: { connect: { id: faultId } },
      },
    });
    return NextResponse.json(unacceptableStageItem, { status: 200 });
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
