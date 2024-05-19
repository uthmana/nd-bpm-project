import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { Fault, Prisma, Stock } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

//All Faults
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['NORMAL', 'ADMIN','SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const fault = await prisma.fault.findMany({
      include: { faultControl: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(fault, { status: 200 });
  } catch (e) {
    console.log({ e });
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
    //TODO: restrict unathorized user : allow all but TECH
    const allowedRoles = ['NORMAL', 'ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
    const result: Fault | any = await req.json();

    const { customerName, productCode, application, product_barcode } = result;

    if (!customerName || !productCode || !application || !product_barcode) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const tempDefaultParams = result?.defaultTechParameter;
    let tempFault: any = { ...result };
    delete tempFault.defaultTechParameter;

    const fault = await prisma.fault.create({
      data: {
        ...tempFault,
        defaultTechParameter: {
          create: tempDefaultParams,
        },
      },
    });

    if (fault) {
      const stockData = await prisma.stock.findUnique({
        where: { product_code: fault.productCode },
      });

      const {
        customerId,
        productCode,
        quantity,
        product,
        technicalDrawingAttachment,
        productBatchNumber,
      } = fault;

      if (!stockData) {
        const stock: Stock = await prisma.stock.create({
          data: {
            product_code: productCode,
            product_name: product,
            inventory: quantity,
            current_price: '',
            curency: '',
            image: technicalDrawingAttachment,
            customerId: customerId,
            faultId: fault.id,
            product_barcode,
            productBatchNumber,
          },
        });
      }

      if (stockData) {
        const stock: Stock = await prisma.stock.update({
          where: { id: stockData.id, customerId },
          data: {
            product_code: productCode,
            product_name: product,
            inventory: quantity + stockData.inventory,
            current_price: '',
            curency: '',
            image: technicalDrawingAttachment,
            customerId: customerId,
            faultId: fault.id,
            product_barcode,
            productBatchNumber,
          },
        });
      }
    }

    //Create Notification
    const notification = await prisma.notification.create({
      data: {
        title: 'Ürün Girişi',
        description: `Yeni ürün girişi yapıldı.`,
        receiver: 'SUPER',
        link: `/admin/entry/${fault.id}`,
      },
    });

    return NextResponse.json({ fault }, { status: 200 });
  } catch (e) {
    console.log({ e });
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
