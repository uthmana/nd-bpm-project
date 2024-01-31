import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { checkUserRole } from 'utils/auth';
import { Prisma, Process } from '@prisma/client';

//All  Process
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['TECH', 'ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const result = searchParams.get('result');

    if (status && result) {
      const process = await prisma.process.findMany({
        include: {
          finalControl: {
            where: { result: 'ACCEPT' },
          },
        },
        where: { status: 'FINISHED' },
      });

      return NextResponse.json(process, { status: 200 });
    }
    const process = await prisma.process.findMany({
      include: { technicalParams: true },
    });

    return NextResponse.json(process, { status: 200 });
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

// Create  Process
export async function PUT(req: Request) {
  try {
    const allowedRoles = ['TECH'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
    const reqBody: Process = await req.json();
    //TODO: validate reqBody
    const process = await prisma.process.create({
      data: reqBody,
    });

    return NextResponse.json(process, { status: 200 });
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
