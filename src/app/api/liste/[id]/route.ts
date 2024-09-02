import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;

    const [
      faultmeta,
      processmeta,
      faulcontrolmeta,
      applicationsmeta,
      invoicemeta,
      offermeta,
    ] = await prisma.$transaction([
      prisma.fault.findMany({
        select: {
          createdAt: true,
          arrivalDate: true,
          faultDescription: true,
          customerName: true,
          invoiceDate: true,
          standard: true,
          status: true,
          technicalDrawingAttachment: true,
          unacceptable: true,
          customer: {
            select: {
              company_name: true,
            },
          },
        },
      }),
      prisma.process.findUnique({
        where: { faultId: id },
        select: {
          createdAt: true,
          createdBy: true,
          shipmentQty: true,
          product_barcode: true,
          status: true,
          machineName: true,
          price: true,
          productCode: true,
        },
      }),
      prisma.faultControl.findUnique({
        where: { faultId: id },
        select: {
          processFrequency: true,
          arrivalDate: true,
          controlDate: true,
          frequencyDimension: true,
          remarks: true,
          traceabilityCode: true,
          quantity: true,
          image: true,
          plating: true,
          dimensionConfirmation: true,
          quantityConfirmation: true,
          productBatchNumber: true,
          productCode: true,
          result: true,
          dirtyThreads: true,
        },
      }),
      prisma.applications.findUnique({
        where: { id: id },
        select: { name: true, id: true },
      }),
      prisma.invoice.findMany({
        where: { process: { some: { faultId: id } } },

        select: {
          invoiceDate: true,
          amount: true,
          address: true,
          createdAt: true,
          createdBy: true,
          tax_Office: true,
          status: true,
          totalAmount: true,
        },
      }),
      prisma.offer.findMany({
        where: { product: { some: { id: id } } },
        select: {
          Customer: true,
          description: true,
          docPath: true,
          creatorTitle: true,
          OfferType: true,
          status: true,
          startDate: true,
          totalAmount: true,
          email: true,
        },
      }),
    ]);

    return NextResponse.json(
      {
        faultMeta: faultmeta,
        processMeta: processmeta,
        faultControlMeta: faulcontrolmeta,
        applicationMeta: applicationsmeta,
        invoiceMeta: invoicemeta,
        offerMeta: offermeta,
      },
      { status: 200 },
    );
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
