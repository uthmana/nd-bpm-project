import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { Fault, FaultControl, Prisma, Process } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

//Get single Fault Control
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ message: 'Access forbidden', status: 403 });
    }
    const id = route.params.id;
    const faultControl: FaultControl = await prisma.faultControl.findFirst({
      where: { faultId: id },
    });
    if (!faultControl) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(faultControl, { status: 200 });
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

//Update FaultControl
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const data: FaultControl = await req.json();
    const {
      faultId,
      result: controlReult,
      processFrequency,
      frequencyDimension,
    } = data;

    const faultControl: FaultControl = await prisma.faultControl.findUnique({
      where: { id },
    });

    if (!faultControl) {
      return NextResponse.json(
        { message: 'Content not found' },
        { status: 401 },
      );
    }

    const updateFaultControl = await prisma.faultControl.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });

    const faultControlAccepted =
      controlReult === 'ACCEPT' ||
      controlReult === 'ACCEPTANCE_WITH_CONDITION' ||
      controlReult === 'PRE_PROCESS';

    const updateFault: Fault = await prisma.fault.update({
      where: {
        id: faultId,
      },
      data: {
        status: faultControlAccepted ? 'PROSES_BEKLIYOR' : 'GIRIS_KONTROL_RET',
      },
    });

    //Handle Process
    // if (result !== 'ACCEPT') {
    //   const processData: Process = await prisma.process.findFirst({
    //     where: { faultId },
    //   });
    //   if (processData) {
    //     const processDel = await prisma.process.delete({
    //       where: { id: processData.id },
    //     });
    //   }
    // }

    // if (result !== 'REJECT') {
    //   const processData: Process = await prisma.process.findUnique({
    //     where: { faultId },
    //   });

    //   if (!processData && updateFault) {
    //     const processCreate = await prisma.process.create({
    //       data: {
    //         frequency: frequencyDimension,
    //         Fault: { connect: { id: faultId } },
    //       },
    //     });
    //   } else {
    //     if (updateFault) {
    //       const processUpdate = await prisma.process.update({
    //         where: { id: processData.id },
    //         data: {
    //           frequency: frequencyDimension,
    //         },
    //       });
    //     }
    //   }
    // }

    return NextResponse.json(updateFaultControl, { status: 200 });
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

//Delete Fault Control
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedFault = await prisma.faultControl.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json([deletedFault], { status: 200 });
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
