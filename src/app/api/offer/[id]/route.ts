import { NextRequest, NextResponse } from 'next/server';
import { checkUserRole } from 'utils/auth';
import { Offer, Prisma } from '@prisma/client';
import { sendOffer } from 'app/lib/apiRequest';
import prisma from '../../../lib/db';

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
    //TODO: findUnique is not working in prod
    //const id = route.params.id;
    // const offer: Offer = await prisma.offer.findUnique({
    //   where: { id: id },
    //   include: { product: true, Customer: true },
    // });
    const id = route.params.id;
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { Customer: true, product: true },
    });

    return NextResponse.json(offer, { status: 200 });
  } catch (e) {
    console.error('Error fetching offer:', e);
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientRustPanicError
    ) {
      return NextResponse.json(e, { status: 403 });
    }
    return NextResponse.json({ message: e }, { status: 500 });
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
    const result: any = await req.json();
    const offer: Partial<Offer> = await prisma.offer.findUnique({
      where: { id },
    });

    if (!offer) {
      return NextResponse.json({ message: 'Offer Not Found' }, { status: 404 });
    }

    const { id: offerId, product, ...rest } = result;
    const incomingProductIds = product.map((p) => p.id).filter((id) => id);
    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: {
        ...rest,
        product: {
          deleteMany: {
            id: {
              notIn: incomingProductIds,
            },
          },
          upsert: product.map((p) => ({
            where: { id: p.id || '0' },
            create: {
              name: p.name,
              application: p.application,
              standard: p.standard,
              currency: p.currency,
              quantity: p.quantity,
              price: p.price,
              unitPrice: p.unitPrice,
              description: p.description,
              image: p.image,
            },
            update: {
              name: p.name,
              application: p.application,
              standard: p.standard,
              currency: p.currency,
              quantity: p.quantity,
              price: p.price,
              unitPrice: p.unitPrice,
              description: p.description,
              image: p.image,
            },
          })),
        },
      },
      include: {
        product: true,
      },
    });

    if (!updatedOffer) {
      return NextResponse.json(
        { message: 'Offer Update Error' },
        { status: 404 },
      );
    }

    //const offerData: any = result;
    if (updatedOffer.status === 'SENT') {
      const { status, response }: any = await sendOffer({
        type: 'offer',
        email: updatedOffer.email,
        subject: 'Teklif | ND Industries',
        data: updatedOffer,
      });
      if (response?.error || status !== 200) {
        return NextResponse.json(
          { message: response?.error?.message },
          { status: response.status },
        );
      }
    }

    return NextResponse.json(updatedOffer, { status: 200 });
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
