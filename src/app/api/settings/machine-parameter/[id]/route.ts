import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import next from 'next';
import { check } from 'prettier';
import { checkUserRole } from 'utils/auth';
import { MachineParams, Prisma } from '@prisma/client';

//Get single  machineParams
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const id = route.params.id;
    const machineParams: MachineParams = await prisma.machineParams.findUnique({
      where: { id: id },
    });
    if (!machineParams) {
      throw new Error('Fault not found');
    }
    return NextResponse.json(machineParams, { status: 200 });
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

//Update  machineParamss
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const id = route.params.id;

    const resultData: MachineParams = await req.json();
    if (!resultData) {
      return NextResponse.json({ error: 'Mising required value' });
    }

    const machineParamsTobeUpdated: MachineParams =
      await prisma.machineParams.findUnique({
        where: { id },
      });
    if (!machineParamsTobeUpdated) {
      return NextResponse.json({
        error: 'machineParams to be updated no fould',
      });
    }

    const UpdatedmachineParams: MachineParams =
      await prisma.machineParams.update({
        where: { id },
        data: {
          ...resultData,
        },
      });

    if (!UpdatedmachineParams) {
      return NextResponse.json({ error: 'Error in updating machineParams' });
    }
    return NextResponse.json(UpdatedmachineParams, { status: 200 });
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

//Delete  machineParamss
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
    const machineParamsToBeDeleted: MachineParams =
      await prisma.machineParams.findUnique({
        where: { id },
      });
    if (!machineParamsToBeDeleted) {
      return NextResponse.json({
        error: 'machineParams to be deleted not fould',
      });
    }
    const DeletedmachineParams: MachineParams =
      await prisma.machineParams.delete({
        where: { id },
      });
    if (!DeletedmachineParams) {
      return NextResponse.json({
        error: 'Error occured whiles deleting machineParams',
        status: 401,
      });
    }
    return NextResponse.json(DeletedmachineParams, { status: 200 });
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
