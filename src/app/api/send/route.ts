import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import ResetPassword from '../../../emails/resetPassword';
import prisma from 'app/lib/db';
import crypto from 'crypto';
import InvoiceDoc from 'components/invoice';
// import createPDF from 'utils/generatePDF';
import OfferDoc from 'components/offer';
import OfferTemplete from '../../../emails/offer';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const formData = await request.json();

  const emailBody: any = {
    from: 'ND Industries<info@ndindustriesbmp.com>',
    to: formData.email,
    subject: formData.subject,
    text: formData.text,
  };

  if (formData.type === 'offer') {
    //emailBody.react = OfferTemplete({ offer: formData.data });
    emailBody.text =
      'Özel kampanyamızı kaçırmayın! Ürünlerimizde cazip indirim fırsatları sizi bekliyor. Detaylar için bizimle iletişime geçebilirsiniz.';
    emailBody.attachments = [
      {
        filename: 'Teklif.pdf',
        path: formData?.data?.docPath,
      },
    ];

    const { data, error }: any = await resend.emails.send(emailBody);
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode },
      );
    }
    return NextResponse.json({ data }, { status: 200 });
  }

  if (formData.type === 'invoice') {
    formData.data.serverSide = true;
    const pdfPath = formData.docPath;
    emailBody.attachments = [
      {
        filename: 'Invoice.pdf',
        path: pdfPath,
      },
    ];

    const { data, error }: any = await resend.emails.send(emailBody);
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode },
      );
    }
    return NextResponse.json(data, { status: 200 });
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

    emailBody.react = ResetPassword({
      token: resetPasswordToken,
      userName: user.name,
    });

    const { data, error } = await resend.emails.send(emailBody);

    if (error) {
      const { statusCode, message, name }: any = error;
      return NextResponse.json({ message, name }, { status: statusCode });
    }
    return NextResponse.json({ data }, { status: 200 });
  }
  return NextResponse.json({ error: 'Unknown User' }, { status: 404 });
}
