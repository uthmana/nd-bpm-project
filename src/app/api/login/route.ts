import { NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { compare } from 'bcryptjs';
import { extractPrismaErrorMessage } from 'utils/prismaError';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Hatalı E-posta veya Şifre' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email, status: 'ACTIVE' },
    });
    if (user) {
      const passwordMatch = await compare(password, user.password);

      if (passwordMatch) {
        // Passwords match, return success
        return NextResponse.json(user, { status: 200 });
      } else {
        // Passwords don't match
        return NextResponse.json(
          { message: 'Hatalı E-posta veya Şifre' },
          { status: 401 },
        );
      }
    } else {
      // User not found
      return NextResponse.json(
        { message: 'Hatalı E-posta veya Şifre' },
        { status: 401 },
      );
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
