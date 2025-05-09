import { NextRequest, NextResponse } from 'next/server';
import { Unacceptable } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';
import prisma from 'app/lib/db';

//Get single offer
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const unacceptable: Partial<Unacceptable> =
      await prisma.unacceptable.findUnique({
        where: { id: id },
      });

    return NextResponse.json(unacceptable, { status: 200 });
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

//Update offer
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
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

//Delete offer
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
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
