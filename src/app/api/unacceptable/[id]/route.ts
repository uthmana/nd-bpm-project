import { NextRequest, NextResponse } from 'next/server';
import { checkUserRole } from 'utils/auth';
import { Unacceptable, Prisma } from '@prisma/client';

//Get single offer
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['ADMIN', 'SUPER', 'TECH'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }

    const id = route.params.id;
    const unacceptable: Partial<Unacceptable> =
      await prisma.unacceptable.findUnique({
        where: { id: id },
      });

    return NextResponse.json(unacceptable, { status: 200 });
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

//Update offer
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['ADMIN', 'SUPER', 'TECH'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }

    const id = route.params.id;
    const result: Unacceptable = await req.json();
    const unacceptable: Partial<Unacceptable> =
      await prisma.unacceptable.findUnique({
        where: { id },
      });

    if (!unacceptable) {
      return NextResponse.json({ message: 'No record found' }, { status: 204 });
    }
    const unacceptableUpdate = await prisma.unacceptable.update({
      where: {
        id: id,
      },
      data: result,
    });
    return NextResponse.json(unacceptableUpdate, { status: 200 });
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

//Delete offer
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const allowedRoles = ['ADMIN', 'SUPER', 'TECH'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
    const id = route.params.id;
    const deletedUnacceptable = await prisma.unacceptable.delete({
      where: {
        id: id,
      },
    });
    if (deletedUnacceptable) {
      return NextResponse.json(deletedUnacceptable, { status: 200 });
    }
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
