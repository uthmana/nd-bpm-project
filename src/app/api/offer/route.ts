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
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 404 },
      );
    }
    const offers = await prisma.offer.findMany();
    if (!offers) {
      throw new Error('User not found');
    }
    return NextResponse.json(offers, { status: 200 });
  }
}
