
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import ResetPassword from 'components/emails/resetPassword';
import prisma from 'app/lib/db';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const formData = await request.json();
  const emailBody: any = {
    from: 'ND <majeed@ndindustriesbmp.com>',
    to: formData.email,
    subject: formData.subject,
  };

  if (formData.type === 'offer') {
    emailBody.html = `<p>${formData.message}</p>`;
    const { data, error } = await resend.emails.send(emailBody);
    if (error) {
      return NextResponse.json({ error }, { status: 404 });
    }
    return NextResponse.json({ data }, { status: 200 });
  }

  if (formData.type === 'forgotPassword') {
    const user = await prisma.user.findUnique({
      where: { email: formData.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 404 });
    }

    const resetPasswordToken = crypto.randomBytes(32).toString('base64url');

    const today = new Date();
    const tokenExpiryDate = new Date(
      today.getTime() +
        parseInt(process.env.CHANGE_PASSWORD_EXPIRY_TIME) * 60000,
    );


    await prisma.user.update({
      where: { email: formData.email },
      data: { token: resetPasswordToken, tokenExpiryDate },
    });

    emailBody.react = ResetPassword({ token: resetPasswordToken });
    const { data, error } = await resend.emails.send(emailBody);
    if (error) {
      return NextResponse.json({ error }, { status: 404 });
    }
    return NextResponse.json({ data }, { status: 200 });
  }

  return NextResponse.json({ error: 'Unkwon User' }, { status: 404 });
}
