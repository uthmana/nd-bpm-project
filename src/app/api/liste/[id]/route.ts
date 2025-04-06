import { NextRequest, NextResponse } from 'next/server';
import { extractPrismaErrorMessage } from 'utils/prismaError';
import prisma from 'app/lib/db';

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
      prisma.process.findFirst({
        where: { faultId: id },
        select: {
          createdAt: true,
          createdBy: true,
          status: true,
          machineName: true,
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
        where: { Fault: { some: { id } } },
        select: {
          invoiceDate: true,
          amount: true,
          createdAt: true,
          createdBy: true,
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
    console.error('Prisma Error:', e);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      {
        error: userMessage,
        details: technicalMessage,
      },
      { status: 500 },
    );
  }
}
