import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { FinalControl, Prisma } from '@prisma/client';
import { checkUserRole } from 'utils/auth';
import { generateSKU } from 'utils';

//All Final Control
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['SUPER', 'ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
    const finalControl = await prisma.finalControl.findMany();

    return NextResponse.json(finalControl, { status: 200 });
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

// Create Final Control
export async function PUT(req: Request) {
  try {
    //TODO: restrict unathorized user : only super and admin allowed
    const allowedRoles = ['SUPER', 'ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }

    const result: FinalControl | any = await req.json();

    const { faultId, result: controlReult, processId } = result;

    if (!faultId || !controlReult || !processId) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const { testItem, testArea, ...rest } = result;
    const finalControl = await prisma.finalControl.create({
      data: { ...rest },
    });

    if (finalControl) {
      const testResult = await Promise.all(
        testItem?.map(async (item) => {
          await prisma.testItem.create({
            data: { ...item, finalControlId: finalControl.id },
          });
        }),
      );
      const testAreaResult = await Promise.all(
        testArea?.map(async (item) => {
          await prisma.testArea.create({
            data: { ...item, finalControlId: finalControl.id },
          });
        }),
      );
    }

    if (result.result === 'ACCEPT') {
      const fault = await prisma.fault.findUnique({
        where: { id: faultId },
        include: { customer: true },
      });

      if (fault) {
        const { customer } = fault;
        const { id, tax_Office, taxNo, rep_name, address, company_name } =
          customer;
        const barcode = generateSKU(
          'IRSA',
          company_name,
          Math.floor(Math.random() * 1000),
        );

        const invoice = await prisma.invoice.create({
          data: {
            invoiceDate: new Date(),
            customerId: id,
            tax_Office,
            taxNo,
            rep_name,
            address,
            barcode,
          },
        });

        if (invoice) {
          const updatedProcess = await prisma.process.update({
            where: {
              id: processId,
            },
            data: {
              invoiceId: invoice.id,
              shipmentQty: finalControl.nakliye_miktar,
            },
          });
        }
      }
    }

    //Create Notification
    // const notification = await prisma.notification.create({
    //   data: {
    //     title: 'Ürün Final Kontrolü',
    //     description: 'Yeni bir ürün final kontrolü yapıldı',
    //     receiver: 'OTHER',
    //     link: `/admin/process/${processId}`,
    //   },
    // });

    return NextResponse.json(finalControl, { status: 200 });
  } catch (e) {
    console.log(e);
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientRustPanicError
    ) {
      console.log({ e });
      return NextResponse.json(e, { status: 403 });
    }
    return NextResponse.json(e, { status: 500 });
  }
}
