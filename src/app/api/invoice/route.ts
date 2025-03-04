import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Fault, Invoice, Prisma } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

//All Faults
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['NORMAL', 'ADMIN', 'SUPER', 'TECH'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
    const invoice = await prisma.invoice.findMany({
      include: { customer: true, Fault: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(invoice, { status: 200 });
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

// Create Fault
export async function PUT(req: Request) {
  try {
    const allowedRoles = ['NORMAL', 'ADMIN', 'SUPER', 'TECH'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }

    const result: any = await req.json();
    const { Fault, customer, ...rest } = result;

    if (Fault.length === 0 || !customer) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const invoice = await prisma.invoice.create({
      data: {
        ...rest,
        customer: { connect: { id: customer.id } },
        Fault: { connect: Fault.map((item) => ({ id: item.id })) },
      },
    });

    if (invoice) {
      const updateFault = await prisma.fault.updateMany({
        where: {
          id: { in: Fault.map((item) => item.id) },
        },
        data: {
          status: 'SEVKIYAT_TAMAMLANDI',
        },
      });

      // Handle Stock Updates
      for (const faultItem of Fault) {
        const { id: faultId, shipmentQty, quantity, productCode } = faultItem;

        if (!shipmentQty || !quantity || !productCode) continue;

        const stock = await prisma.stock.findUnique({
          where: { faultId },
        });

        if (stock) {
          if (shipmentQty < quantity) {
            // Update stock inventory
            await prisma.stock.update({
              where: { id: stock.id },
              data: {
                inventory: stock.inventory ? stock.inventory - shipmentQty : 0,
              },
            });
          } else {
            // Delete stock if shipmentQty >= quantity
            await prisma.stock.delete({
              where: { id: stock.id },
            });
          }
        }
      }
    }

    return NextResponse.json(invoice, { status: 200 });
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
