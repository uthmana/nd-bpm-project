import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Prisma } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
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
