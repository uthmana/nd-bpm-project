// pages/api/send.js
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import ResetPassword from 'components/emails/resetPassword';

const prisma = new PrismaClient();

const resend = new Resend(process.env.RESEND_API_KEY);

// export async function GET(request: Request) {
//   const allUsers = await prisma.user.findMany();
//   // console.log(allUsers)
//   return NextResponse.json({ allUsers });
// }

export async function POST(request: Request) {
  //TODO: check email type
  // check from the database if the email address exist

  const formData = await request.json();
 
  const emailBody: any = {
    from: 'ND <majeed@ndindustriesbmp.com>',
    to: formData.email,
    subject: formData.subject,
  };

  if (formData.type === 'offer') {
    emailBody.html = `<p>${formData.message}</p>`;
  }

  if (formData.type === 'forgotPassword') {
    emailBody.react = ResetPassword({ token: 'sadasdsdasda' });
  }

  const { data, error } = await resend.emails.send(emailBody);
  if (error) {
    return NextResponse.json({ error }, { status: 404 });
  }
  return NextResponse.json(data, { status: 200 });
}
