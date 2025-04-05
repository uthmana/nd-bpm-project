import { NextResponse, NextRequest } from 'next/server';
import prisma from 'app/lib/db';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//All Application
export async function GET(req: NextRequest) {
  try {
    const applications = await prisma.applications.findMany();
    return NextResponse.json(applications, { status: 200 });
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

// Create Application
export async function PUT(req: Request) {
  try {
    const regData = await req.json();
    const createdApplication = await prisma.applications.create({
      data: regData,
    });

    const applications = await prisma.applications.findMany();
    return NextResponse.json(applications, { status: 200 });
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
