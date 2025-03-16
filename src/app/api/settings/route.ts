import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { extractPrismaErrorMessage } from 'utils/prismaError';

export async function GET(req: NextRequest) {
  try {
    const [applications, standards, colors, machines] =
      await prisma.$transaction([
        prisma.applications.findMany(),
        prisma.standards.findMany(),
        prisma.colors.findMany(),
        prisma.machine.findMany({
          include: { machineParams: true },
        }),
      ]);

    return NextResponse.json(
      {
        applications,
        standards,
        colors,
        machines,
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
