import { NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { compare } from 'bcryptjs';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
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
          { message: 'Email or password is incorrect' },
          { status: 401 },
        );
      }
    } else {
      // User not found
      return NextResponse.json(
        { message: 'Email or password is incorrect' },
        { status: 401 },
      );
    }
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientRustPanicError
    ) {
      return NextResponse.json(e, { status: 403 });
    }
    return NextResponse.json(e, { status: 500 });
  }
}
