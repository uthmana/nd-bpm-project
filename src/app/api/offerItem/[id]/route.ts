import { NextRequest, NextResponse } from 'next/server';
import { checkUserRole } from 'utils/auth';
import { Offer, OfferItem, Prisma } from '@prisma/client';

//Get single offer
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }

    const id = route.params.id;
    const offer: Partial<Offer> = await prisma.offer.findUnique({
      where: { id: id },
      include: { product: true, Customer: true },
    });

    return NextResponse.json({ ...offer });
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
