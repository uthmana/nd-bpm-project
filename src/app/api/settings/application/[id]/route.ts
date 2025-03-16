import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Applications } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//Get single  Application
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const application: Applications = await prisma.applications.findUnique({
      where: { id: id },
    });
    return NextResponse.json(application, { status: 200 });
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

//Update  Applications
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const resultData: Applications = await req.json();

    const ApplicationTobeUpdated: Applications =
      await prisma.applications.findUnique({
        where: { id },
      });

    if (!ApplicationTobeUpdated) {
      return NextResponse.json(
        { message: 'Application to update not found' },
        { status: 404 },
      );
    }

    const UpdatedApplication: Applications = await prisma.applications.update({
      where: { id },
      data: {
        ...resultData,
      },
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

//Delete  Applications
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const id = route.params.id;
    const ApplicationToBeDeleted: Applications =
      await prisma.applications.findUnique({
        where: { id },
      });

    if (!ApplicationToBeDeleted) {
      return NextResponse.json(
        { message: 'Application to be deleted not found' },
        { status: 404 },
      );
    }
    const deletedApplication: Applications = await prisma.applications.delete({
      where: { id },
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
