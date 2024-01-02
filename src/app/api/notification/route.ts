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
    const filtedNotification: Notification[] = notification.filter((item) => {
      return item.receiver === session.user.role;
    });

    return NextResponse.json(filtedNotification, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Update Notification
export async function POST(req: NextRequest) {
  try {
    const reqbody: any = await req.json();
    const { id } = reqbody;
    const notification = await prisma.notification.update({
      where: { id },
      data: { status: 'READ' },
    });
    if (!notification) {
      throw new Error('Notification not found');
    }
    return NextResponse.json(notification, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
