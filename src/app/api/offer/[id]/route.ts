import { NextRequest, NextResponse } from 'next/server';
import { checkUserRole } from 'utils/auth';
import { Offer } from '@prisma/client';

//Get single offer
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }

    const id = route.params.id;
    const offer: Partial<Offer> = await prisma.offer.findUnique({
      where: { id: id },
    });
    if (!offer.id) return NextResponse.json({ message: 'User not found' });
    return NextResponse.json({ ...offer });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Update offer
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }

    const id = route.params.id;
    const result: Offer = await req.json();
    const { ...data } = result;

    const offer: Partial<Offer> = await prisma.offer.findUnique({
      where: { id },
    });

    if (!offer) {
      return NextResponse.json(
        { message: 'Offer not found.' },
        { status: 404 },
      );
    }

    const updateOffer = await prisma.offer.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });
    if (updateOffer) {
      return NextResponse.json({ updateOffer }, { status: 200 });
    }
  } catch (error) {
    console.error('Error updating user', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Delete offer
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }

    const id = route.params.id;
    const deletedOffer = await prisma.offer.delete({
      where: {
        id: id,
      },
    });
    if (deletedOffer) {
      return NextResponse.json({ deletedOffer }, { status: 200 });
    }
  } catch (error) {
    console.error('Error updating offer', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
