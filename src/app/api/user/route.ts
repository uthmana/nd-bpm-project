import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { hash } from 'bcryptjs';
import { checkUserRole } from 'utils/auth';

//All users
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const users = await prisma.user.findMany();
    if (!users) {
      throw new Error('User not found');
    }
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

// Create user
export async function PUT(req: Request) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }

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
