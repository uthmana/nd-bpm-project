import { NextResponse } from 'next/server';
import prisma from 'lib/db';

export async function POST(req: Request) {
  const { title } = await req.json();

  await prisma.todo.create({
    data: { title, complete: false },
  });

  return NextResponse.json({ message: 'Created Todo' }, { status: 200 });
}
