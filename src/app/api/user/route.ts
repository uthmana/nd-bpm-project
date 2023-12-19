// pages/api/userApi.ts
/*
import { NextResponse, NextRequest } from 'next/server';
import prisma from 'lib/db';

export async function POST(req: Request) {
  try {
    const { name, email, password }: User = await req.json();
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    NextResponse.json({ error: 'Internal Server Error' });
  }
}

export async function GET() {}

export async function DELETE() {}
export async function UPDATE() {}
*/

// pages/api/userApi.ts
import { NextResponse, NextRequest } from 'next/server';
import prisma from 'lib/db';

export async function POST(req: Request) {
  try {
    const { name, email, password }: User = await req.json();

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const deletedUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

export async function UPDATE(req: Request) {
  try {
    const { id, updatedFields } = await req.json();
    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: updatedFields,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
