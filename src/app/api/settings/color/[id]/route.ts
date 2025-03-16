import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Colors } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//Get single  Color
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const colors: Colors = await prisma.colors.findUnique({
      where: { id: id },
    });

    return NextResponse.json(colors, { status: 200 });
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

//Update  Colors
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const color: Colors = await req.json();

    const colorTobeUpdated: Colors = await prisma.colors.findUnique({
      where: { id },
    });
    if (!colorTobeUpdated) {
      return NextResponse.json({ message: 'Color not found' }, { status: 404 });
    }

    const UpdatedColor: Colors = await prisma.colors.update({
      where: { id },
      data: {
        ...color,
      },
    });

    const colors = await prisma.colors.findMany();

    return NextResponse.json(colors, { status: 200 });
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

//Delete  Colors
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const id = route.params.id;
    const colorToBeDeleted: Colors = await prisma.colors.findUnique({
      where: { id },
    });

    if (!colorToBeDeleted) {
      return NextResponse.json(
        { message: 'Color to be deleted not found' },
        { status: 404 },
      );
    }
    const DeletedColor: Colors = await prisma.colors.delete({
      where: { id },
    });
    const colors = await prisma.colors.findMany();

    return NextResponse.json(colors, { status: 200 });
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
