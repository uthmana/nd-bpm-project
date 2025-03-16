import { NextResponse, NextRequest } from 'next/server';
import prisma from 'app/lib/db';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//All colors
export async function GET(req: NextRequest) {
  try {
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

// Create Colors
export async function PUT(req: Request) {
  try {
    const regData = await req.json();
    const color = await prisma.colors.create({
      data: regData,
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
