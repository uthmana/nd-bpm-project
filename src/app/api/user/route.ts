// pages/api/userApi.ts
import { NextResponse, NextRequest } from 'next/server';
import prisma from 'app/lib/db1';
import { RiLayoutRightLine } from 'react-icons/ri';

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

//http://localhost:3000/admin/users/1
export async function GET(req: Request) {
  try {
    const { id }: User = await req.json();
    if (id) {
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });
      return NextResponse.json(user);
    }
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
