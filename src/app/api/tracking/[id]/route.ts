import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { hash } from 'bcryptjs';
import { checkUserRole } from 'utils/auth';
import { Prisma, User } from '@prisma/client';

//All trackings Get the FaultEntry, Process and Invoice Trackings
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const trackings = await prisma.$transaction(async (query) => {
      const entry = await query.fault.findUnique({
        where: { id },
        select: {
          arrivalDate: true,
          faultControl: true,
          faultDescription: true,
        },
      });

      const process = await query.process.findUnique({
        where: { faultId: id },
        include: { technicalParams: true },
      });

      const invoice = await query.invoice.findUnique({
        where: { id: id },
        include: { fault: true },
      });

      return {
        entry,
        process,
        invoice,
      };
    });

    return NextResponse.json(trackings, { status: 200 });
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
