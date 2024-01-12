import { NextRequest, NextResponse } from 'next/server';
import { checkUserRole } from 'utils/auth';
import { Offer } from '@prisma/client';

//All offers
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const offers = await prisma.offer.findMany();
    if (!offers) {
      throw new Error('User not found');
    }
    return NextResponse.json(offers, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

// Create offer
export async function PUT(req: Request) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }

    const result: Offer = await req.json();
    if (!result.name || !result.status || !result.id) {
      return NextResponse.json({ message: 'You are missing a required data' });
    }
    const { ...data } = result;
    const offer = await prisma.offer.create({
      data: {
        ...data,
      },
    });
    return NextResponse.json({ offer }, { status: 200 });
  } catch (error) {
    // if (error?.code === 'P2002') {
    //   return NextResponse.json(
    //     { error: 'Email already Exit' },
    //     { status: 404 },
    //   );
    // }
    return NextResponse.json({ error: 'Error ocured while creating offer' });
  }
}
