import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Prisma } from '@prisma/client';
import { validateCustomerSchema } from 'utils/validate';
import { checkUserRole } from 'utils/auth';
import FinalControl from 'components/forms/finalControl';

//All Lists1
export async function GET1(req: NextRequest) {
  try {
    const transactions = await prisma.process.findMany({
      include: {
        finalControl: {
          select: { createdAt: true, createdBy: true, gorunum_kontrol: true },
        },
        Invoice: {
          select: {
            createdAt: true,
            createdBy: true,
            amount: true,
            status: true,
            address: true,
          },
        },
        technicalParams: { select: { createdAt: true, createdBy: true } },
        unacceptable: {
          select: {
            unacceptableAction: true,
            description: true,
            unacceptableStage: true,
          },
        },
      },
    });

    if (transactions) {
      const flattendtransaction = transactions.map((transaction) => ({
        //  ...transaction,
        ...transaction.finalControl,
        ...transaction.Invoice,
        ...transaction.technicalParams,
        // Remove the nested objects to avoid duplication
        finalControl: undefined,
        Invoice: undefined,
        technicalParams: undefined,
        unacceptable: undefined,
      }));

      return NextResponse.json({ flattendtransaction }, { status: 200 });
    }

    return NextResponse.json({}, { status: 200 });
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
          shipmentQty: true,
          product_barcode: true,
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
          address: true,
          createdAt: true,
          createdBy: true,
          tax_Office: true,
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

// Create Customer
export async function PUT(req: Request) {
  try {
    const allowedRoles = ['SUPER', 'ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
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
