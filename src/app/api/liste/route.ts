import { Prisma } from '@prisma/client';
import prisma from 'app/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { extractPrismaErrorMessage } from 'utils/prismaError';
import { validateCustomerSchema } from 'utils/validate';

// GET All the Report on the fault
export async function GET(req: NextRequest) {
  try {
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
        },
      }),
      prisma.process.findMany({
        select: {
          createdAt: true,
          createdBy: true,
          status: true,
        },
      }),
      prisma.faultControl.findMany({
        select: {
          processFrequency: true,
          arrivalDate: true,
          controlDate: true,
          frequencyDimension: true,
          remarks: true,
          traceabilityCode: true,
        },
      }),
      prisma.applications.findMany({ select: { name: true, id: true } }),
      prisma.invoice.findMany({
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
        select: {
          Customer: true,
          description: true,
          docPath: true,
          creatorTitle: true,
          OfferType: true,
          status: true,
          startDate: true,
          totalAmount: true,
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

// Create Customer
export async function PUT(req: Request) {
  try {
    const result: Prisma.CustomerCreateInput = await req.json();
    // Validate the fields against the customer schema
    const validationErrors = await validateCustomerSchema(result);
    if (validationErrors.length > 0) {
      return NextResponse.json({
        error: 'Invalid data format',
        details: validationErrors,
      });
    }
    // Exclude email and password from direct inclusion in the data object
    const { email, ...data } = result;

    // Include other properties using the spread operator
    const customer = await prisma.customer.create({
      data: {
        ...data,
        email: email?.toLocaleLowerCase() ?? '',
      },
    });

    return NextResponse.json(customer, { status: 200 });
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
