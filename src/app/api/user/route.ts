import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db1';
import { hash } from 'bcryptjs';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const { name, email, password, roleId } = await req.json();
    if (!name || !roleId || !email || !password) {
      return NextResponse.json({ message: 'You are missing a required data' });
    }
    const newUser: Partial<User> = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
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
    const users = await prisma.user.findMany();
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
    if (!result.name || !result.email || !result.password) {
      return NextResponse.json({ message: 'You are missing a required data' });
    }
    const { name, role, status, email, password } = result;
    const hashed_password = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        role,
        status,
        email: email.toLowerCase(),
        password: hashed_password,
      },
    });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already Exit' },
        { status: 404 },
      );
    }
    return NextResponse.json({ error: 'Error ocured while creating user' });
  }
}

export async function UPDATE(req: Request) {
  try {
    const result: User = await req.json();
    if (!result.name || !result.email || !result.password) {
      return NextResponse.json({ message: 'You are missing a required data' });
    }
    const { name, role, status, email, password } = result;
    const hashed_password = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        role,
        status,
        email: email.toLowerCase(),
        password: hashed_password,
      },
    });
    if (user) {
      return NextResponse.json({ user }, { status: 200 });
    }
    return NextResponse.json({ error: 'Email Already Exist' });
  } catch (error) {
    console.error('Error updating user', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
