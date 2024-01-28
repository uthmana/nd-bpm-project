import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { checkUserRole } from 'utils/auth';
import { Notification, Prisma, User } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from 'app/lib/authOptions';

//All Notification
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (session === null) {
      return NextResponse.json([], { status: 404 });
    }

    const notification = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (!notification) {
      return NextResponse.json([], { status: 404 });
    }

    const filtedNotification: Notification[] = notification.filter((item) => {
      return item.status === 'NOT_READ';
    });

    if (session.user.role === 'ADMIN') {
      const not_reads = filtedNotification.filter((item) => {
        const today = new Date();
        const notificTodoy = new Date(today.getTime() - 30 * 60000);
        const createdAt = new Date(item.createdAt);
        return createdAt < notificTodoy;
      });
      return NextResponse.json(not_reads, { status: 200 });
    }

    const roleBaseNotific: Notification[] = notification.filter((item) => {
      return item.receiver === session.user.role && item.status === 'NOT_READ';
    });

    return NextResponse.json(roleBaseNotific, { status: 200 });
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

//Update Notification
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json([], { status: 204 });
    }

    const reqbody: any = await req.json();
    const { id } = reqbody;

    if (session?.user?.role === 'ADMIN') {
      return NextResponse.json([], { status: 204 });
    }
    const notification = await prisma.notification.update({
      where: { id },
      data: { status: 'READ' },
    });

    return NextResponse.json(notification, { status: 200 });
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
