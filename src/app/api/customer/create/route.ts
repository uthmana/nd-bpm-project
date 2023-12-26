import prisma from 'app/lib/db1';
import bcrypt, { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const user = await prisma.customer.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return NextResponse.json({
        error: 'Customer already exist with this email',
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

      // await tx.account.create({
      //   data: {
      //     userId: id,
      //     type: 'credentials',
      //     provider: 'credentials',
      //     providerAccountId: id,
      //   },
      // });

      await tx.customer.create({
        data: {
          email,
          name: name,
          password: passwordHash,
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
