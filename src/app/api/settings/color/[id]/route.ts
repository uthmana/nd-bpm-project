import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { Colors, Prisma } from '@prisma/client';
import next from 'next';
import { check } from 'prettier';
import { checkUserRole } from 'utils/auth';

//Get single  Color
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const id = route.params.id;
    const Colors: Colors = await prisma.colors.findUnique({
      where: { id: id },
    });
    if (!Colors) {
      throw new Error('Fault not found');
    }
    return NextResponse.json(Colors, { status: 200 });
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

//Update  Colors
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const id = route.params.id;

    const colors: Colors = await req.json();
    if (!colors) {
      return NextResponse.json({ error: 'Mising required value' });
    }

    const colorTobeUpdated: Colors = await prisma.colors.findUnique({
      where: { id },
    });
    if (!colorTobeUpdated) {
      return NextResponse.json({ error: 'Color to be updated no fould' });
    }

    const UpdatedColor: Colors = await prisma.colors.update({
      where: { id },
      data: {
        ...colors,
      },
    });

    if (!UpdatedColor) {
      return NextResponse.json({ error: 'Error in updating Color' });
    }
    return NextResponse.json(UpdatedColor, { status: 200 });
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

//Delete  Colors
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const id = route.params.id;
    const colorToBeDeleted: Colors = await prisma.colors.findUnique({
      where: { id },
    });
    if (!colorToBeDeleted) {
      return NextResponse.json({ error: 'Color to be deleted not fould' });
    }
    const DeletedColor: Colors = await prisma.colors.delete({
      where: { id },
    });
    if (!DeletedColor) {
      return NextResponse.json({
        error: 'Error occured whiles deleting color',
        status: 401,
      });
    }
    return NextResponse.json(DeletedColor, { status: 200 });
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
