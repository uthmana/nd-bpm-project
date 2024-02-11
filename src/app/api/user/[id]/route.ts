import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { hash } from 'bcryptjs';
import { checkUserRole } from 'utils/auth';
import { Prisma, User } from '@prisma/client';

//Get single user
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }

    const id = route.params.id;
    const user: Partial<User> = await prisma.user.findUnique({
      where: { id: id },
    });
    return NextResponse.json({ ...user, password: '' });
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

//Update user
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }

    const id = route.params.id;
    const result: User = await req.json();
    const { name, email, password, role, status } = result;

    if (!name || !email) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }
    const user: Partial<User> = await prisma.user.findUnique({
      where: { email },
    });

    let pwd = user.password;
    if (password) {
      pwd = await hash(password, 12);
    }

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

    return NextResponse.json({ updateUser }, { status: 200 });
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

//Delete user
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }

    const id = route.params.id;
    const deletedUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ deletedUser }, { status: 200 });
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
