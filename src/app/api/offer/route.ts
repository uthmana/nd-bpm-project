import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { Prisma } from '@prisma/client';
//All offers
export async function GET(req: NextRequest) {
  const offers = await prisma.offer.findMany({
    //where: { customerId: 'hdskdsjklcjds' },
  });
  return NextResponse.json(offers, { status: 200 });
}

export async function PUT(req: NextRequest) {
  try {
    const offerdata: Prisma.OfferCreateInput = await req.json();
    const offers = await prisma.offer.create({ data: { ...offerdata } });
    return NextResponse.json(offers, { status: 200 });
  } catch (e) {
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
