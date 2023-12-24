import prisma from '../../lib/db1';
import bcrypt, { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

/*
export async function POST(req: Request) {
  try {
    const { name, email, password } = (await req.json()) as {
      name: string;
      email: string;
      password: string;
    };
    const hashed_password = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashed_password,
      },
    });

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: error.message,
      }),
      { status: 500 },
    );
  }
}
*/

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return NextResponse.json({
        error: 'User already exist with this email',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction(async (tx) => {
      const { id } = await tx.user.create({
        data: {
          email,
          name: name,
          password: passwordHash,
        },
      });

      await tx.account.create({
        data: {
          userId: id,
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: id,
        },
      });
    });

    return NextResponse.json({
      message: 'User created successfully.',
    });
  } catch (error) {
    return NextResponse.json({
      error: 'System error. Please contact support',
    });
  }
}
