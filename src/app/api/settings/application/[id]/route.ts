import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { Applications, Prisma } from '@prisma/client';
import next from 'next';
import { check } from 'prettier';
import { checkUserRole } from 'utils/auth';

//Get single  Application
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const id = route.params.id;
    const application: Applications = await prisma.applications.findUnique({
      where: { id: id },
    });
    if (!application) {
      throw new Error('Fault not found');
    }
    return NextResponse.json(application, { status: 200 });
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

//Update  Applications
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const id = route.params.id;

    const resultData: Applications = await req.json();
    if (!resultData) {
      return NextResponse.json({ error: 'Mising required value' });
    }

    const ApplicationTobeUpdated: Applications =
      await prisma.applications.findUnique({
        where: { id },
      });
    if (!ApplicationTobeUpdated) {
      return NextResponse.json({ error: 'Application to be updated no fould' });
    }

    const UpdatedApplication: Applications = await prisma.applications.update({
      where: { id },
      data: {
        ...resultData,
      },
    });

    if (!UpdatedApplication) {
      return NextResponse.json({ error: 'Error in updating Application' });
    }
    return NextResponse.json(UpdatedApplication, { status: 200 });
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

//Delete  Applications
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
    const ApplicationToBeDeleted: Applications =
      await prisma.applications.findUnique({
        where: { id },
      });
    if (!ApplicationToBeDeleted) {
      return NextResponse.json({
        error: 'Application to be deleted not fould',
      });
    }
    const DeletedApplication: Applications = await prisma.applications.delete({
      where: { id },
    });
    if (!DeletedApplication) {
      return NextResponse.json({
        error: 'Error occured whiles deleting Application',
        status: 401,
      });
    }
    return NextResponse.json(DeletedApplication, { status: 200 });
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
