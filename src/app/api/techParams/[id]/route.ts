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
    const { processId } = result;

    if (!processId) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const techParams: TechnicalParameter =
      await prisma.technicalParameter.findUnique({
        where: { id },
      });

    const updatedtechParams = await prisma.technicalParameter.update({
      where: {
        id: id,
      },
      data: {
        ...result,
      },
    });

    const techParamsData = await prisma.technicalParameter.findMany({
      where: { processId },
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
