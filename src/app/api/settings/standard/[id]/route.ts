import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Standards } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//Get single  standards
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const standards: Standards = await prisma.standards.findUnique({
      where: { id: id },
    });

    return NextResponse.json(standards, { status: 200 });
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

//Update  standardss
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const resultData: Standards = await req.json();

    const standardsTobeUpdated: Standards = await prisma.standards.findUnique({
      where: { id },
    });

    if (!standardsTobeUpdated) {
      return NextResponse.json(
        { message: 'Standard to be updated not found' },
        { status: 404 },
      );
    }

    const Updatedstandards: Standards = await prisma.standards.update({
      where: { id },
      data: {
        ...resultData,
      },
    });

    const standards = await prisma.standards.findMany();
    return NextResponse.json(standards, { status: 200 });
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

//Delete  standardss
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const id = route.params.id;
    const standardsToBeDeleted: Standards = await prisma.standards.findUnique({
      where: { id },
    });
    if (!standardsToBeDeleted) {
      return NextResponse.json(
        { message: 'Standard to be deleted not found' },
        { status: 404 },
      );
    }

    const deletedstandards: Standards = await prisma.standards.delete({
      where: { id },
    });

    const standards = await prisma.standards.findMany();
    return NextResponse.json(standards, { status: 200 });
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
