import { NextRequest, NextResponse } from 'next/server';
import { Fault, Prisma, Stock } from '@prisma/client';
import { checkUserRole } from 'utils/auth';
import prisma from '../../../lib/db';

//Get single Fault
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['NORMAL', 'TECH', 'ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
    const id = route.params.id;
    const fault: Fault = await prisma.fault.findUnique({
      where: { id: id },
      include: {
        faultControl: true,
        unacceptable: true,
        defaultTechParameter: true,
        customer: true,
      },
    });
    return NextResponse.json(fault, { status: 200 });
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

export async function POST(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const allowedRoles = ['NORMAL', 'TECH', 'ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }

    const filters: Fault | any = await req.json();
    const id = route.params.id;
    const fault: Fault = await prisma.fault.findUnique({
      where: { id: id },
      include: filters,
    });

    return NextResponse.json(fault, { status: 200 });
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

//Update Fault
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['NORMAL', 'ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
    const id = route.params.id;
    const result: Fault | any = await req.json();
    const {
      customerName,
      productCode,
      quantity,
      application,
      product_barcode,
    } = result;

    if (!customerName || !productCode || !quantity || !application) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const fault: Fault | any = await prisma.fault.findUnique({
      where: { id },
    });

    if (!fault) {
      return NextResponse.json({ message: 'No such fault' }, { status: 401 });
    }

    const {
      unacceptable,
      process,
      finalControl,
      defaultTechParameter,
      ...updatedData
    } = result;

    const faultData = { ...updatedData };
    delete faultData.customerId;
    delete faultData.customerName;

    const updatedFault = await prisma.fault.update({
      where: {
        id: id,
      },
      data: {
        ...faultData,
        defaultTechParameter: {
          ...(defaultTechParameter.id
            ? {
                update: {
                  where: { id: defaultTechParameter.id },
                  data: defaultTechParameter,
                },
              }
            : {
                create: defaultTechParameter,
              }),
        },
      },
    });

    //Tracking Stock
    if (updatedFault) {
      const {
        customerId,
        productCode,
        product,
        quantity,
        technicalDrawingAttachment,
        productBatchNumber,
      } = updatedFault;

      const stockData = await prisma.stock.findUnique({
        where: {
          faultId: updatedFault.id,
        },
      });

      if (stockData) {
        const stock: Stock = await prisma.stock.update({
          where: {
            faultId: updatedFault.id,
          },
          data: {
            product_code: productCode,
            product_name: product,
            inventory: quantity,
            current_price: '',
            image: technicalDrawingAttachment,
            customerId: customerId,
            product_barcode,
            productBatchNumber,
            defaultTechParameter: {
              connect: defaultTechParameter,
            },
          },
        });
      }
    }
    return NextResponse.json(updatedFault, { status: 200 });
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

//Delete Fault
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const allowedRoles = ['NORMAL', 'TECH', 'ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
    const id = route.params.id;
    const deletedFault: Fault = await prisma.fault.delete({
      where: {
        id: id,
      },
    });

    //Tracking stock
    if (deletedFault) {
      const stockData = await prisma.stock.findUnique({
        where: {
          faultId: id,
        },
      });
      if (stockData) {
        const updateStock = await prisma.stock.update({
          where: {
            faultId: id,
          },
          data: { inventory: 0 },
        });
      }
    }

    return NextResponse.json(deletedFault, { status: 200 });
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
