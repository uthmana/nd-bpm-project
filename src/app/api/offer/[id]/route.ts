import { NextRequest, NextResponse } from 'next/server';
import { checkUserRole } from 'utils/auth';
import { Offer, Prisma } from '@prisma/client';
import { sendOffer } from 'app/lib/apiRequest';

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

    return NextResponse.json(offer, { status: 200 });
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
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }

    const id = route.params.id;
    const result: Offer = await req.json();
    const offer: Partial<Offer> = await prisma.offer.findUnique({
      where: { id },
    });

    if (offer) {
      const offerData: any = result;
      if (offerData.status === 'SENT') {
        const { status, response }: any = await sendOffer({
          type: 'offer',
          email: offerData.email,
          subject: 'Fiyat Teklifi',
          data: offerData,
        });
        if (status === 403) {
          return NextResponse.json(
            { message: response?.error?.message },
            { status: response.status },
          );
        }
        const updateOffer = await prisma.offer.update({
          where: {
            id: id,
          },
          data: { status: offer.status },
        });
        return NextResponse.json(updateOffer, { status: 200 });
      }

      delete offerData?.product;
      delete offerData?.Customer;
      const updateOffer = await prisma.offer.update({
        where: {
          id: id,
        },
        data: offerData,
      });
      return NextResponse.json(updateOffer, { status: 200 });
    }
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
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
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
