import { NextRequest, NextResponse } from 'next/server';
import { Offer } from '@prisma/client';
import { sendOffer } from 'app/lib/apiRequest';
import prisma from 'app/lib/db';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//Get single offer
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { Customer: true, product: true },
    });

    return NextResponse.json(offer, { status: 200 });
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

//Update offer
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: any = await req.json();
    const offer: Partial<Offer> = await prisma.offer.findUnique({
      where: { id },
    });

    if (!offer) {
      return NextResponse.json({ message: 'Offer Not Found' }, { status: 404 });
    }

    const { id: offerId, product, ...rest } = result;
    const incomingProductIds = product.map((p) => p.id).filter((id) => id);
    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: {
        ...rest,
        product: {
          deleteMany: {
            id: {
              notIn: incomingProductIds,
            },
          },
          upsert: product.map((p) => ({
            where: { id: p.id || '0' },
            create: {
              name: p.name,
              application: p.application,
              standard: p.standard,
              currency: p.currency,
              quantity: p.quantity,
              price: p.price,
              unitPrice: p.unitPrice,
              description: p.description,
              image: p.image,
            },
            update: {
              name: p.name,
              application: p.application,
              standard: p.standard,
              currency: p.currency,
              quantity: p.quantity,
              price: p.price,
              unitPrice: p.unitPrice,
              description: p.description,
              image: p.image,
            },
          })),
        },
      },
      include: {
        product: true,
      },
    });

    if (!updatedOffer) {
      return NextResponse.json(
        { message: 'Offer Update Error' },
        { status: 404 },
      );
    }

    //const offerData: any = result;
    if (updatedOffer.status === 'SENT') {
      const { status, response }: any = await sendOffer({
        type: 'offer',
        email: updatedOffer.email,
        subject: 'Teklif | ND Industries',
        data: updatedOffer,
      });
      if (response?.error || status !== 200) {
        return NextResponse.json(
          { message: response?.error?.message },
          { status: response.status },
        );
      }
    }

    return NextResponse.json(updatedOffer, { status: 200 });
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

//Delete offer
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const id = route.params.id;
    const deletedOffer = await prisma.offer.delete({
      where: {
        id: id,
      },
    });
    if (deletedOffer) {
      return NextResponse.json({ deletedOffer }, { status: 200 });
    }
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
