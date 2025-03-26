import { NextRequest, NextResponse } from 'next/server';
import { $Enums, NotifReceiver, User, UserRole } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';
import {
  sendEmailNotification,
  sendWhatsAppMessage,
} from 'app/lib/notificationRequest';
import { formatPhoneNumber } from 'utils';

type SelectedUser = Pick<
  User,
  'id' | 'name' | 'email' | 'role' | 'contactNumber'
>;

const getRecipientRole = (workflowId: string) => {
  return ({
    'fault-entry': 'SUPER',
    'fault-control': 'TECH',
    'process-frequency': 'TECH',
    'process-control': 'SUPER',
    'process-completion': 'ADMIN',
  }[workflowId] || 'OTHER') as UserRole;
};

export async function POST(req: Request) {
  try {
    const { workflowId, data } = await req.json();
    const recipientRole: UserRole = getRecipientRole(workflowId);

    const users: SelectedUser[] = await prisma.user.findMany({
      where: { status: 'ACTIVE', role: recipientRole as UserRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        contactNumber: true,
      },
    });

    if (!users.length) return NextResponse.json([], { status: 200 });

    if (workflowId === 'process-frequency' && data?.userId) {
      const { userId: id } = data;
      const user: SelectedUser = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          contactNumber: true,
        },
      });
      //TODO: Send OTP SMS message
      return NextResponse.json(user, { status: 200 });
    }

    // In-App Notification
    const inappNotification = await prisma.notification.create({
      data: {
        title: data.title,
        description: data.description,
        link: data.link,
        recipient: recipientRole,
      },
    });

    // WhatsApp Notifications
    // const recipientPhoneNumbers = users
    //   .map((user) => formatPhoneNumber(user.contactNumber))
    //   .filter(Boolean) as string[];
    // await Promise.all(
    //   recipientPhoneNumbers.map((phone) =>
    //     sendWhatsAppMessage(phone, `${data.title} -- ${data.description}`),
    //   ),
    // );

    // Email Notifications
    const uniqueEmails = [...new Set(users.map((user) => user.email))];
    await sendEmailNotification(
      uniqueEmails,
      data.title,
      data.description,
      data.link,
    );

    return NextResponse.json(inappNotification, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(error);
    return NextResponse.json(
      { error: userMessage, details: technicalMessage },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const role: NotifReceiver | any = searchParams.get('role');
    const time = searchParams.get('time');

    const where: any = {};
    if (role) where.recipient = $Enums.NotifReceiver[role];
    if (time) where.createdAt = { gte: time };

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notifications, { status: 200 });
  } catch (e) {
    console.error('Prisma Error:', e);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      { error: userMessage, details: technicalMessage },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: 'You are missing required data' },
        { status: 400 },
      );
    }

    const updatedNotifications = await prisma.notification.updateMany({
      where: { id: { in: ids } },
      data: {
        status: 'READ',
      },
    });

    return NextResponse.json(updatedNotifications, { status: 200 });
  } catch (e) {
    console.error('Prisma Error:', e);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      {
        error: userMessage,
        details: technicalMessage,
      },
      { status: 500 },
    );
  }
}
