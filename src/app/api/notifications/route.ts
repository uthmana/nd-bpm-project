import { NextResponse } from 'next/server';
import { Knock } from '@knocklabs/node';

const knockClient = new Knock(process.env.KNOCK_SIGNING_KEY);

export async function POST(req: Request) {
  const { workflowId, data } = await req.json();
  try {
    const users = await prisma.user.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    let recipients;
    switch (workflowId) {
      case 'fault-entry':
        recipients = users.filter((item) => item.role === 'SUPER');
        break;
      case 'fault-control':
        recipients = users.filter((item) => item.role === 'TECH');
        break;
      case 'process-frequency':
        recipients = users.filter((item) => item.role === 'TECH');
        break;
      case 'process-control':
        recipients = users.filter((item) => item.role === 'SUPER');
        break;
      case 'process-completion':
        recipients = users.filter((item) => item.role === 'ADMIN');
        break;

      default:
        recipients = users;
    }

    if (!recipients.length) {
      return NextResponse.json({}, { status: 200 });
    }
    const res = await knockClient.workflows.trigger(workflowId, {
      data,
      recipients,
    });
    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 404 });
  }
}
