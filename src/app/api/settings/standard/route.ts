import { NextResponse, NextRequest } from 'next/server';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//All standards
export async function GET(req: NextRequest) {
  try {
    const standardss = await prisma.standards.findMany();
    return NextResponse.json(standardss, { status: 200 });
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

// Create standards
export async function PUT(req: Request) {
  try {
    const regData = await req.json();
    const createdstandards = await prisma.standards.create({
      data: regData,
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
