import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { extractPrismaErrorMessage } from 'utils/prismaError';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const startOfMonth = searchParams.get('start');
    const endOfMonth = searchParams.get('end');

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
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
            status: 'ACCEPT',
          },
        }),
        query.process.count({
          where: {
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
            status: 'FINISHED',
          },
        }),
        query.invoice.count({
          where: {
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
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
          include: {
            Fault: {
              include: {
                customer: true,
              },
            },
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
          process: monthlyProcess,
          invoice: monthlyInvoice,
        },
        recentProcess: recentProcess,
        recentCustomer: recentCustomer,
      };
    });

    return NextResponse.json(trackings, { status: 200 });
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
