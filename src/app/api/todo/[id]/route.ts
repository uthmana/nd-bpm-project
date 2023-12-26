import { NextResponse } from 'next/server';
import prisma from '../../../lib/db1';

export async function PATCH(
  req: Request,
  { params: { id } }: { params: { id: string } },
) {
  const { completed } = await req.json();

 /* await prisma.todo.update({
    where: {
      id: id,
    },
    data: {
      complete: completed,
    },
  });*/
  return NextResponse.json({ message: 'Updated' }, { status: 200 });
}



