import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { checkUserRole } from 'utils/auth';
import { Notification, User } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from 'app/lib/authOptions';

//All Notification
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  try {
    const notification = await prisma.notification.findMany();
    if (!notification) {
      throw new Error('Notification not found');
    }
    //TODO: fix the filter func
    const filtedNotification: Notification[] = notification.filter((item) => {
      item.receiver === session.user.role;
    });

    return NextResponse.json(filtedNotification, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const reqbody: any = await req.json();
    if (reqbody.role !== 'ADMIN') {
      const notification = await prisma.notification.findMany({
        where: { receiver: reqbody.role, status: 'NOT_READ' },
      });
      if (!notification) {
        throw new Error('Notification not found');
      }
      return NextResponse.json(notification, { status: 200 });
    }
    return NextResponse.json([], { status: 204 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
