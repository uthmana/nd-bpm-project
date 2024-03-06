import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { OfferItem, Prisma } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

//All offers
export async function GET(req: NextRequest) {
  const allowedRoles = ['NORMAL', 'ADMIN', 'SUPER'];
  const hasrole = await checkUserRole(allowedRoles);
  if (!hasrole) {
    return NextResponse.json({ message: 'Access forbidden' }, { status: 403 });
  }
  const offers = await prisma.offerItem.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(offers, { status: 200 });
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
