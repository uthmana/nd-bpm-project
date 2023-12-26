import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db1';
import { hash } from 'bcryptjs';
import { checkUserRole } from 'utils/auth';

//Get single user
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }

    const id = route.params.id;
    const user: Partial<User> = await prisma.user.findUnique({
      where: { id: id },
    });
    if (!user.id) return NextResponse.json({ message: 'User not found' });
    return NextResponse.json({ ...user, password: '' });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Update user
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }

    const id = route.params.id;
    const result: User = await req.json();
    const { name, email, password, role, status } = result;
    if (!result.name || !result.email || !result.password) {
      return NextResponse.json({ message: 'You are missing a required data' });
    }
    const pwd = await hash(password, 12);
    const updateUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        role,
        status,
        password: pwd,
        updatedAt: new Date(),
      },
    });
    if (updateUser) {
      return NextResponse.json({ updateUser }, { status: 200 });
    }
  } catch (error) {
    console.error('Error updating user', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Delete user
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }

    const id = route.params.id;
    const deletedUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    if (deletedUser) {
      return NextResponse.json({ deletedUser }, { status: 200 });
    }
  } catch (error) {
    console.error('Error updating user', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
