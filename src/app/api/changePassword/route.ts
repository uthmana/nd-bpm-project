import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  const body = await req.json();
  const { token, newPassword } = body;

  if (!token || !newPassword) {
    return NextResponse.json({ message: 'Bad request.' }, { status: 404 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { token: token },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid token.' }, { status: 404 });
    }

    const today = new Date();
    if (today > user.tokenExpiryDate) {
      return NextResponse.json({ message: 'Token expired.' }, { status: 404 });
    }
    const password = await hash(newPassword, 12);
    await prisma.user.update({
      where: { token: token },
      data: { password: password, token: null, tokenExpiryDate: null },
    });
    return NextResponse.json(
      { message: 'Password Changed :)' },
      { status: 200 },
    );
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
