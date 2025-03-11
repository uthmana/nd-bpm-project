import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { hash } from 'bcryptjs';
import { User } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//All users
export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(users, { status: 200 });
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

// Create user
export async function PUT(req: Request) {
  try {
    const result: User = await req.json();
    if (!result.name || !result.email || !result.password) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }
    const { name, role, status, email, password, contactNumber } = result;
    const hashed_password = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        role,
        status,
        contactNumber,
        email,
        password: hashed_password,
      },
    });
    return NextResponse.json({ user }, { status: 200 });
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
