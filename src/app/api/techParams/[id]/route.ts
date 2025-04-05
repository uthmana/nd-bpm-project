import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { TechnicalParameter } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

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
    console.error('Prisma Error:', e);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      {
        error: userMessage,
        details: technicalMessage,
      },
      { status: 500 },
    );
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

    if (!techParams) {
      return NextResponse.json(
        { message: 'TechnicalParameter could nıt be found' },
        { status: 401 },
      );
    }

    await prisma.technicalParameter.update({
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
    console.error('Prisma Error:', e);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      {
        error: userMessage,
        details: technicalMessage,
      },
      { status: 500 },
    );
  }
}

//Delete  TechParams
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const id = route.params.id;

    const deletedTechParams = await prisma.technicalParameter.delete({
      where: {
        id: id,
      },
    });

    if (!deletedTechParams) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const techParamsData = await prisma.technicalParameter.findMany({
      where: { processId: deletedTechParams.processId },
    });
    return NextResponse.json(techParamsData, { status: 200 });
  } catch (e) {
    console.error('Prisma Error:', e);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      {
        error: userMessage,
        details: technicalMessage,
      },
      { status: 500 },
    );
  }
}
