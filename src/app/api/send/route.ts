// pages/api/send.js

import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  //TODO: check send type

  //if(type === 'send email for change-password'){
  //localhost://3000/auth/change-password?token=fdgffgfdgfdghdf
  //}

  try {
    const formData = await request.json();
    console.log('formData', formData);
    const data = await resend.emails.send({
      from: 'ND <majeed@ndindustriesbmp.com>',
      to: formData.email,
      subject: formData.subject,
      html: `<p>${formData.message}</p>`, // it can be a react component
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
