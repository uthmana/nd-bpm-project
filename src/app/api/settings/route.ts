import { authOptions } from '../../lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from 'app/lib/db';

export async function GET(request: Request) {
  try {
    const applications = await prisma.applications.findMany();
    const standards = await prisma.standards.findMany();
    const color = await prisma.colors.findMany();

    return NextResponse.json(
      {
        applications,
        standards,
        colors: color,
      },
      { status: 200 },
    );
  } catch (e) {
    console.log({ e });
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
