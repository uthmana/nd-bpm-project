import { authOptions } from '../../../lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { checkUserRole } from 'utils/auth';
import { Prisma } from '@prisma/client';

//All standards
export async function GET(req: NextRequest) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const standardss = await prisma.standards.findMany();
    if (!standardss) {
      throw new Error('No standards found');
    }
    return NextResponse.json(standardss, { status: 200 });
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

// Create standards
export async function PUT(req: Request) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const regData = await req.json();
    const createdstandards = await prisma.standards.create({
      data: regData,
    });

    if (!createdstandards) {
      throw new Error('No standards found');
    }

    return NextResponse.json({ createdstandards }, { status: 200 });
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
