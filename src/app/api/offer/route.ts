import { NextRequest } from 'next/server';
import prisma from '../../lib/db';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  const offers = await prisma.offer.findMany({
    take: 10,
    where: { customerId: 'hdskdsjklcjds' },
  });
}

export async function  PUT(req:NextRequest) {
try{
 
  const offerdata:Prisma.OfferCreateInput=await req.json();
  const offers=await prisma.offer.create({data:{ ...offerdata}}) 

  
  return NextResponse.json({ customer }, { status: 200 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 404 },
      );
    }
    return NextResponse.json({
      error: 'Error occurred while creating customer',
    });
  }
}
  
  
}
