import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Prisma } from '@prisma/client';
import { getMonthlySum, getMonthAndWeekDates } from 'utils';

export async function GET(req: NextRequest) {
  try {
    const { startOfMonth, endOfMonth } = getMonthAndWeekDates();
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
      prisma.customer.count(),
      prisma.stock.count({
        where: {
          inventory: {
            gt: 0,
          },
        },
      }),
      prisma.fault.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
          status: 'ACCEPT',
        },
      }),
      prisma.process.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
          status: 'FINISHED',
        },
      }),
      prisma.invoice.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
          status: 'PAID',
        },
      }),
      prisma.offer.count({
        where: {
          status: 'SENT',
        },
      }),
      prisma.process.findMany({
        where: {
          status: 'FINISHED',
        },
      }),
      prisma.invoice.findMany({
        where: {
          status: 'PAID',
        },
      }),
      prisma.process.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.customer.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);
    const trackings = {
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

    // const trackings = await prisma.$transaction(async (query) => {
    //   const [
    //     customer,
    //     stock,
    //     entry,
    //     process,
    //     invoice,
    //     offer,
    //     monthlyProcess,
    //     monthlyInvoice,
    //     recentProcess,
    //     recentCustomer,
    //   ] = await Promise.all([
    //     query.customer.count(),
    //     query.stock.count({
    //       where: {
    //         inventory: {
    //           gt: 0,
    //         },
    //       },
    //     }),
    //     query.fault.count({
    //       where: {
    //         createdAt: {
    //           gte: startOfMonth,
    //           lte: endOfMonth,
    //         },
    //         status: 'ACCEPT',
    //       },
    //     }),
    //     query.process.count({
    //       where: {
    //         createdAt: {
    //           gte: startOfMonth,
    //           lte: endOfMonth,
    //         },
    //         status: 'FINISHED',
    //       },
    //     }),
    //     query.invoice.count({
    //       where: {
    //         createdAt: {
    //           gte: startOfMonth,
    //           lte: endOfMonth,
    //         },
    //         status: 'PAID',
    //       },
    //     }),
    //     query.offer.count({
    //       where: {
    //         status: 'SENT',
    //       },
    //     }),
    //     query.process.findMany({
    //       where: {
    //         status: 'FINISHED',
    //       },
    //     }),
    //     query.invoice.findMany({
    //       where: {
    //         status: 'PAID',
    //       },
    //     }),
    //     query.process.findMany({
    //       take: 5,
    //       orderBy: {
    //         createdAt: 'desc',
    //       },
    //     }),
    //     query.customer.findMany({
    //       take: 5,
    //       orderBy: {
    //         createdAt: 'desc',
    //       },
    //     }),
    //   ]);
    //   return {
    //     widget: {
    //       customer: customer,
    //       stock: stock,
    //       entry: entry,
    //       process: process,
    //       invoice: invoice,
    //       offer: offer,
    //     },
    //     monthlyEntry: {
    //       process: getMonthlySum(monthlyProcess, 'createdAt'),
    //       invoice: getMonthlySum(monthlyInvoice, 'createdAt'),
    //     },
    //     recentProcess: recentProcess,
    //     recentCustomer: recentCustomer,
    //   };
    // });
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
