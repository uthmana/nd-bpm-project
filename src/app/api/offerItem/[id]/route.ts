import { NextRequest, NextResponse } from 'next/server';
import { Offer, OfferItem } from '@prisma/client';
import { extractPrismaErrorMessage } from 'utils/prismaError';

//Get single offer
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const offer: Partial<Offer> = await prisma.offer.findUnique({
      where: { id: id },
      include: { product: true, Customer: true },
    });

    return NextResponse.json({ ...offer });
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
    const result: OfferItem = await req.json();
    const offerItem = await prisma.offerItem.findUnique({
      where: { id },
    });
    const updatedOfferItem = await prisma.offerItem.update({
      where: { id },
      data: result,
    });
    return NextResponse.json(updatedOfferItem, { status: 200 });
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
    const deletedOfferItem = await prisma.offerItem.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(deletedOfferItem, { status: 200 });
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
