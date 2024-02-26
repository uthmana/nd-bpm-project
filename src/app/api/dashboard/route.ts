import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Prisma } from '@prisma/client';
import { getMonthAndWeekDates } from 'utils';

export async function GET(req: NextRequest) {
  try {
    const { startOfMonth, endOfMonth, startOfWeek, endOfWeek } =
      getMonthAndWeekDates();
    const trackings = await prisma.$transaction(async (query) => {
      const [
        customer,
        stock,
        entry,
        process,
        invoice,
        offer,
        weeklyFault,
        weeklyProcess,
        monthlyFault,
        monthlyProcess,
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

        query.fault.findMany({
          where: {
            createdAt: {
              gte: startOfWeek,
              lte: endOfWeek,
            },
            status: 'ACCEPT',
          },
        }),
        query.process.findMany({
          where: {
            createdAt: {
              gte: startOfWeek,
              lte: endOfWeek,
            },
            status: 'FINISHED',
          },
        }),
        query.fault.findMany({
          where: {
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
            status: 'ACCEPT',
          },
        }),
        query.process.findMany({
          where: {
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
            status: 'FINISHED',
          },
        }),
      ]);

      //   const weeklyFault = await prisma.fault.findMany({
      //     where: {
      //       createdAt: {
      //         gte: startOfWeek,
      //         lte: endOfWeek,
      //       },
      //       status: 'ACCEPT',
      //     },
      //   });

      //   const weeklyProcess = await prisma.process.findMany({
      //     where: {
      //       createdAt: {
      //         gte: startOfWeek,
      //         lte: endOfWeek,
      //       },
      //       status: 'FINISHED',
      //     },
      //   });

      //   const monthlyFault = await prisma.fault.findMany({
      //     where: {
      //       createdAt: {
      //         gte: startOfMonth,
      //         lte: endOfMonth,
      //       },
      //       status: 'ACCEPT',
      //     },
      //   });

      //   const monthlyProcess = await prisma.process.findMany({
      //     where: {
      //       createdAt: {
      //         gte: startOfMonth,
      //         lte: endOfMonth,
      //       },
      //       status: 'FINISHED',
      //     },
      //   });

      return {
        widget: {
          customer: customer,
          stock: stock,
          entry: entry,
          process: process,
          invoice: invoice,
          offer: offer,
        },
        weeklyEntry: {
          entry: weeklyFault,
          process: weeklyProcess,
        },
        monthlyEntry: {
          entry: monthlyFault,
          process: monthlyProcess,
        },
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
