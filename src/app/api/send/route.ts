// pages/api/send.js
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import ResetPassword from 'components/emails/resetPassword';
import prisma from 'app/lib/db1';

const resend = new Resend(process.env.RESEND_API_KEY);
const secretKey = process.env.CHANGE_PASSWORD_SECRET;
const validityMinutes = process.env.CHANGE_PASSWORD_SESSION_TIME;

function encryptWithTimestamp(
  text: string,
  secret: Buffer,
  validityMinutes: number,
): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', secret, iv);

  const timestamp = Date.now();
  const expirationTime = validityMinutes
    ? timestamp + validityMinutes * 60 * 1000
    : null;

  const dataToEncrypt = JSON.stringify({ text, timestamp, expirationTime });

  // eslint-disable-next-line no-use-before-define
  let encrypted = cipher.update(dataToEncrypt, 'utf-8', 'hex');
  // eslint-disable-next-line no-use-before-define
  encrypted += cipher.final('hex');

  // Include the IV in the result
  const result = `${encrypted}:${iv.toString('hex')}`;
  return result;
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
      const token = encryptWithTimestamp(
        formData.email,
        Buffer.from(secretKey, 'hex'),
        +validityMinutes,
      ); //userType should be token
      //check if this user has token. compare the curent token and the new
      // Assuming there's a 'token' field in the user model
      await prisma.user.update({
        where: { email: formData.email },
        data: { token }, //we need to create a field token to store this value instead of name.
      });
      emailBody.react = ResetPassword({ token: token });
      const { data, error } = await resend.emails.send(emailBody);
      if (error) {
        return NextResponse.json({ error }, { status: 404 });
      }
      console.log(
        `https://nd-bpm-project.vercel.app/auth/change-password?token=${token}`,
      );

      return NextResponse.json({ data }, { status: 200 });
    }
  }

  return NextResponse.json({ error: 'Unkwon User' }, { status: 404 });
}
