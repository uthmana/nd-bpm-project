import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import next from 'next';
import { check } from 'prettier';
import { checkUserRole } from 'utils/auth';
import { Machine, Prisma } from '@prisma/client';

//Get single  Machine
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const id = route.params.id;
    const Machine: Machine = await prisma.machine.findUnique({
      where: { id: id },
    });
    if (!Machine) {
      throw new Error('Fault not found');
    }
    return NextResponse.json(Machine, { status: 200 });
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

//Update  Machines
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const id = route.params.id;

    const resultData: Machine = await req.json();
    if (!resultData) {
      return NextResponse.json({ error: 'Mising required value' });
    }

    const MachineTobeUpdated: Machine = await prisma.machine.findUnique({
      where: { id },
    });
    if (!MachineTobeUpdated) {
      return NextResponse.json({ error: 'Machine to be updated no fould' });
    }

    const UpdatedMachine: Machine = await prisma.machine.update({
      where: { id },
      data: {
        ...resultData,
      },
    });

    if (!UpdatedMachine) {
      return NextResponse.json({ error: 'Error in updating Machine' });
    }
    return NextResponse.json(UpdatedMachine, { status: 200 });
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

//Delete  Machines
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
    const MachineToBeDeleted: Machine = await prisma.machine.findUnique({
      where: { id },
    });
    if (!MachineToBeDeleted) {
      return NextResponse.json({
        error: 'Machine to be deleted not fould',
      });
    }
    const DeletedMachine: Machine = await prisma.machine.delete({
      where: { id },
    });
    if (!DeletedMachine) {
      return NextResponse.json({
        error: 'Error occured whiles deleting Machine',
        status: 401,
      });
    }
    return NextResponse.json(DeletedMachine, { status: 200 });
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
