import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { FaultControl, Prisma } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

//All Faults
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ message: 'Access forbidden', status: 403 });
    }
    const fault = await prisma.fault.findMany({ where: { status: 'PENDING' } });
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

// Create Fault Control
export async function PUT(req: Request) {
  try {
    //TODO: restrict unathorized user : only super and admin allowed
    const allowedRoles = ['SUPER', 'ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const result: FaultControl = await req.json();
    const {
      faultId,
      result: controlReult,
      processFrequency,
      frequencyDimension,
    } = result;

    if (!faultId || !controlReult) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const faultControl = await prisma.faultControl.create({
      data: result,
    });

    const updateFault = await prisma.fault.update({
      where: {
        id: faultId,
      },
      data: { status: controlReult },
    });

    //Create Process when faultControl is accepted
    if (
      controlReult === 'ACCEPT' ||
      controlReult === 'ACCEPTANCE_WITH_CONDITION'
    ) {
      if (updateFault) {
        const {
          id,
          customerName,
          customerId,
          product,
          quantity,
          productCode,
          product_barcode,
          application,
          standard,
          color,
          technicalDrawingAttachment,
        } = updateFault;
        const process = await prisma.process.create({
          data: {
            customerName,
            customerId,
            product,
            quantity,
            productCode,
            application,
            standard,
            color,
            technicalDrawingAttachment,
            frequency: `${processFrequency}:${frequencyDimension}`,
            faultId: id,
            product_barcode,
          },
        });

        //if (processFrequency) {
        // try {
        //   await sendNotification({
        //     workflowId: 'process-entry',
        //     data: {
        //       link: location.origin + '/admin/entry/' + process?.id,
        //     },
        //   });
        // } catch (err) {
        //   console.log(err);
        // }
        // const notification = await prisma.notification.create({
        //   data: {
        //     title: 'Frekans Aralığı',
        //     description: `Frekans Aralığı girilmesi gerekir`,
        //     receiver: 'TECH',
        //     link: `admin/process/create/${process?.id}`,
        //   },
        // });
        // }
      }
    }

    //Create Notification
    // const notification = await prisma.notification.create({
    //   data: {
    //     title: 'Ürün Giriş Kontrolü',
    //     description: `Yeni bir ürün Giriş Kontrolü yapıldı.`,
    //     receiver: 'TECH',
    //     link: `/admin/entry/${faultControl?.faultId}`,
    //   },
    // });

    // try {
    //   await sendNotification({
    //     workflowId: 'process-entry',
    //     data: {
    //       link: `${process.env.NEXT_PUBLIC_BASE_PATH}/admin/entry/${faultControl?.faultId}`,
    //     },
    //   });
    // } catch (err) {
    //   console.log(err);
    // }

    return NextResponse.json(faultControl, { status: 200 });
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
