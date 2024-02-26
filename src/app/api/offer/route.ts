import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { OfferItem, Prisma } from '@prisma/client';
import { checkUserRole } from 'utils/auth';
import { sendOffer } from 'app/lib/apiRequest';

//All offers
export async function GET(req: NextRequest) {
  const allowedRoles = ['NORMAL', 'ADMIN', 'SUPER'];
  const hasrole = await checkUserRole(allowedRoles);
  if (!hasrole) {
    return NextResponse.json({ message: 'Access forbidden' }, { status: 403 });
  }

  const offers = await prisma.offer.findMany({
    include: { Customer: true, product: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(offers, { status: 200 });
}

export async function PUT(req: NextRequest) {
  try {
    const offerTemp: Prisma.OfferCreateInput = await req.json();
    const { product } = offerTemp;
    if (!product) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }
    const offerData = { ...offerTemp };
    delete offerData.product;
    const offer = await prisma.offer.create({ data: { ...offerData } });

    if (offer) {
      const offerItemData: any = product;
      const offerItems = await Promise.all(
        offerItemData.map(async (item) => {
          const offerItem = await prisma.offerItem.create({
            data: { ...item, offerId: offer.id },
          });
        }),
      );
    }

    if (offer) {
      const offerRes: any = await sendOffer({
        type: 'offer',
        email: offerData.email,
        subject: 'Fiyat Teklifi',
        data: offerTemp,
      });
    }

    return NextResponse.json(offer, { status: 200 });
  } catch (e) {
    console.log(e);
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientRustPanicError
    ) {
      return NextResponse.json(e, { status: 403 });
    }
    return NextResponse.json(e, { status: 500 });
  }
}
