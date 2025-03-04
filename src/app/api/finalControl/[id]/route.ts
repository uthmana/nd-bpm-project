import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { FinalControl, Invoice, Prisma } from '@prisma/client';
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
    const { faultId, result: controlReult } = data;

    if (!faultId || !controlReult) {
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
      testItem,
      testArea,
      faultId: _faultId,
      ...rest
    } = data;

    const updateFinalControl = await prisma.finalControl.update({
      where: { id: finalControlId },
      data: {
        ...rest,
        testItem: {
          update: testItem.map((item) => {
            const { finalControlId, ...restTestItem } = item;
            return {
              where: { id: item.id },
              data: { ...restTestItem },
            };
          }),
        },
        testArea: {
          update: testArea.map((area) => {
            const { finalControlId, ...restTestArea } = area;
            return {
              where: { id: area.id },
              data: { ...restTestArea },
            };
          }),
        },
      },
    });

    if (updateFinalControl) {
      const updateFault = await prisma.fault.update({
        where: {
          id: faultId,
        },
        data: {
          shipmentQty: updateFinalControl.nakliye_miktar,
          status:
            controlReult !== 'REJECT'
              ? 'IRSALIYE_KESIMI_BEKLIYOR'
              : 'FINAL_KONTROL_RET',
        },
      });
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
