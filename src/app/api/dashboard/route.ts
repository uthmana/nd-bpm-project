import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Prisma } from '@prisma/client';
import { getMonthlySum } from 'utils';

export async function GET(req: NextRequest) {
  try {
    const trackings = await prisma.$transaction(async (query) => {
      const [
        customer,
        stock,
        entry,
        process,
        invoice,
        offer,

        monthlyProcess,
        monthlyInvoice,

        recentProcess,
        recentCustomer,
      ] = await Promise.all([
        query.customer.count(),
        query.stock.count({
          where: {
            inventory: {
              gt: 0,
            },
          },
        }),
        query.fault.count({
          where: {
            status: 'ACCEPT',
          },
        }),
        query.process.count({
          where: {
            status: 'FINISHED',
          },
        }),
        query.invoice.count({
          where: {
            status: 'PAID',
          },
        }),
        query.offer.count({
          where: {
            status: 'SENT',
          },
        }),
        query.process.findMany({
          where: {
            status: 'FINISHED',
          },
        }),
        query.invoice.findMany({
          where: {
            status: 'PAID',
          },
        }),
        query.process.findMany({
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        query.customer.findMany({
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);
      return {
        widget: {
          customer: customer,
          stock: stock,
          entry: entry,
          process: process,
          invoice: invoice,
          offer: offer,
        },
        monthlyEntry: {
          process: getMonthlySum(monthlyProcess, 'createdAt'),
          invoice: getMonthlySum(monthlyInvoice, 'createdAt'),
        },
        recentProcess: recentProcess,
        recentCustomer: recentCustomer,
      };
    });

    return NextResponse.json(trackings, { status: 200 });
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
