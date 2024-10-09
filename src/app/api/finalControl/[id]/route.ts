import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { FinalControl, Prisma } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

//Get single FaultControl
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['SUPER', 'ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
    const id = route.params.id;
    const finalControl: FinalControl = await prisma.finalControl.findFirst({
      where: { id },
    });
    if (!finalControl) {
      return NextResponse.json([], { status: 200 });
    }
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

//Update FinalControl
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const data: FinalControl | any = await req.json();
    const { faultId, result, updatedBy, processId } = data;

    if (!faultId || !result || !processId) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const finalControl: FinalControl | any =
      await prisma.finalControl.findUnique({
        where: { id },
      });

    if (!finalControl) {
      return NextResponse.json(
        { message: 'Content not found' },
        { status: 404 },
      );
    }

    const {
      id: finalControlId,
      faultId: finalControlFaultId,
      testItem,
      testArea,
      ...rest
    } = data;
    const updateFinalControl = await prisma.finalControl.update({
      where: {
        id: id,
      },
      data: {
        ...rest,
      },
    });

    if (updateFinalControl) {
      const testResult = await Promise.all(
        testItem?.map(async (item) => {
          const { id, updatedAt, createdAt, finalControlId, ...rest } = item;
          await prisma.testItem.update({
            where: { id: id },
            data: { ...rest },
          });
        }),
      );

      const testAreaResult = await Promise.all(
        testArea?.map(async (item) => {
          const { id, finalControlId, ...rest } = item;
          await prisma.testArea.update({
            where: { id: id },
            data: { ...rest },
          });
        }),
      );
    }

    // Update Invoice and Process
    if (result === 'REJECT') {
      const process = await prisma.process.findUnique({
        where: {
          id: processId,
        },
      });

      if (process && process.invoiceId) {
        const updatedProcess = await prisma.process.update({
          where: {
            id: processId,
          },
          data: { invoiceId: null },
        });
        const invoice = await prisma.invoice.findUnique({
          where: { id: process.invoiceId },
        });

        if (invoice && invoice.status !== 'PAID') {
          const deletedInvoice = await prisma.invoice.delete({
            where: {
              id: process.invoiceId,
            },
          });
        }
      }
      return NextResponse.json(updateFinalControl, { status: 200 });
    }

    if (result === 'ACCEPT') {
      //Update invoice if exit
      const process = await prisma.process.findUnique({
        where: { id: processId },
      });

      if (process.invoiceId) {
        const invoice = await prisma.invoice.findUnique({
          where: { id: process.invoiceId },
        });
        if (invoice) {
          const updatedProcess = await prisma.process.update({
            where: {
              id: processId,
            },
            data: { invoiceId: invoice.id },
          });
        }
        return NextResponse.json(updateFinalControl, { status: 200 });
      }

      //Create invoice if not exit
      const fault = await prisma.fault.findUnique({
        where: { id: faultId },
        include: { customer: true },
      });

      if (fault) {
        const { customer } = fault;
        const { id, tax_Office, taxNo, rep_name, address } = customer;
        const invoice = await prisma.invoice.create({
          data: {
            invoiceDate: new Date(),
            customerId: id,
            tax_Office,
            taxNo,
            rep_name,
            address,
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
        return NextResponse.json(updateFinalControl, { status: 200 });
      }
    }

    return NextResponse.json(updateFinalControl, { status: 200 });
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

//Delete FinalControl
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedFinalControl = await prisma.finalControl.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(deletedFinalControl, { status: 200 });
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
