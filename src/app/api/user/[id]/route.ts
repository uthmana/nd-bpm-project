import { NextResponse } from 'next/server';
import prisma from '../../../lib/db1';
export async function GET(req: Request) {
  try {
    const id = req.url.slice(req.url.lastIndexOf('/') + 1);

    const user: Partial<User> = await prisma.user.findUnique({
      where: { id: id },
    });
    if (!user.id) return NextResponse.json({ message: 'User not found' });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
