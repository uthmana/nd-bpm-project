import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { extractPrismaErrorMessage } from 'utils/prismaError';

export async function GET(req: NextRequest) {
  try {
    const [applications, standards, color] = await prisma.$transaction([
      prisma.applications.findMany(),
      prisma.standards.findMany(),
      prisma.colors.findMany(),
    ]);

    return NextResponse.json(
      {
        applications,
        standards,
        colors: color,
      },
      { status: 200 },
    );
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
