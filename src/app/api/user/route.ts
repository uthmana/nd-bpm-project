import { NextRequest, NextResponse } from 'next/server';

import prisma from '../../lib/db1';

export async function POST(req: Request) {
  try {
    const { name, email, password, roleId } = await req.json();
    if (!name || !roleId || !email || !password) {
      return NextResponse.json({ message: 'You are missing a required data' });
    }
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
        roleId: roleId,
      },
    });

    return NextResponse.json({ message: `Created ${name} user` });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

export async function GET(req: NextRequest) {
  try {
    const users: User[] = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

export async function DELETE(req: Request) {
  const { id }: Partial<User> = await req.json();

  if (!id) return NextResponse.json({ message: 'User id required' });

  const res = await prisma.user.delete({ where: { id } });
  return NextResponse.json({ message: `User ${id} deleted` });
}

export async function PUT(req: Request) {
  try {
    const result: User = await req.json();
    if (!result.name || !result.roleId || !result.email || !result.password) {
      return NextResponse.json({ message: 'You are missing a required data' });
    }
    const { name, email, password, roleId, id } = result;
    const newUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        password,
        roleId,
      },
    });

    return NextResponse.json({ message: `Updated ${name} user ` });
  } catch (error) {
    console.error('Error updating user', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
