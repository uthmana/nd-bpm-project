// pages/api/send.js
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import ResetPassword from 'components/emails/resetPassword';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const secretKey = process.env.NEXTAUTH_SECRET;
const validityMinutes = process.env.CHANGE_PASSWORD_SESSION_TIME;

function encryptWithTimestamp(text, secret, validityMinutes) {
  const timestamp = Date.now().toString();
  const dataToEncrypt = `${text}${timestamp}`;

  const cipher = crypto.createCipher('aes-256-cbc', secret);
  let encrypted = cipher.update(dataToEncrypt, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

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
    // Log the user information for debugging
    console.log('User that requested a change for password: ', user);

    if (user) {
      // Generate an encrypted token of the user email with a secret key and make it expire after some time
      const name = encryptWithTimestamp(
        formData.email,
        secretKey,
        validityMinutes,
      ); //userType should be token

      // Assuming there's a 'token' field in the user model
      await prisma.user.update({
        where: { email: formData.email },
        data: { name },
      });
      emailBody.react = ResetPassword({ token: name });
      const { data, error } = await resend.emails.send(emailBody);
      if (error) {
        return NextResponse.json({ error }, { status: 404 });
      }
      return NextResponse.json({ data }, { status: 200 });
    }
  }

  return NextResponse.json({ error: 'Unkwon User' }, { status: 404 });
}
