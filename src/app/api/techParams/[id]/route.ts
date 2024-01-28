import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { Prisma, TechnicalParameter } from '@prisma/client';

//Get single  TechParams
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const techParams: TechnicalParameter =
      await prisma.technicalParameter.findUnique({
        where: { id: id },
      });
    if (!techParams) {
      throw new Error('TechParams not found');
    }
    return NextResponse.json(techParams, { status: 200 });
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

//Update  TechParams
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: TechnicalParameter = await req.json();
    //TODO: validate reqBody
    const { processId } = result;

    if (!processId) {
      throw new Error('You are missing a required data');
    }

    const techParams: TechnicalParameter =
      await prisma.technicalParameter.findUnique({
        where: { id },
      });

    if (!techParams) {
      return NextResponse.json(
        { message: 'TechParams not found.' },
        { status: 404 },
      );
    }

    const updatedtechParams = await prisma.technicalParameter.update({
      where: {
        id: id,
      },
      data: {
        ...result,
      },
    });
    if (!updatedtechParams) {
      return NextResponse.json(
        { error: 'Error occuired while updating TechParams' },
        { status: 401 },
      );
    }
    const techParamsData = await prisma.technicalParameter.findMany({
      where: { machineId: updatedtechParams.machineId },
      orderBy: [{ createdAt: 'asc' }],
    });

    return NextResponse.json(techParamsData, { status: 200 });
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

//Delete  TechParams
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedTechParams = await prisma.technicalParameter.delete({
      where: {
        id: id,
      },
    });
    if (!deletedTechParams) {
      return NextResponse.json(
        { error: 'Error occuired while deleting TechParams' },
        { status: 401 },
      );
    }
    const techParamsData = await prisma.technicalParameter.findMany({
      where: { machineId: deletedTechParams.machineId },
    });
    return NextResponse.json(techParamsData, { status: 200 });
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
