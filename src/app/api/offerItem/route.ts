import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { OfferItem } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//All offers
export async function GET(req: NextRequest) {
  try {
    const offers = await prisma.offerItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(offers, { status: 200 });
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

export async function PUT(req: NextRequest) {
  try {
    const offerItemData: OfferItem = await req.json();
    const { name, application, currency, quantity, price, offerId } =
      offerItemData;
    if (!name || !application || !currency || !quantity || !price || !offerId) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }
    const offerItem = await prisma.offerItem.create({ data: offerItemData });

    return NextResponse.json(offerItem, { status: 200 });
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
