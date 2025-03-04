import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { checkUserRole } from 'utils/auth';
import { Prisma, Process } from '@prisma/client';
import { connect } from 'http2';
//All  Process
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['NORMAL', 'TECH', 'ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }

    //const searchParams = req.nextUrl.searchParams;
    // const status = searchParams.get('status');
    // const result = searchParams.get('result');
    // if (status && status === 'finished' && result && result === 'accept') {
    //   const _process = await prisma.process.findMany({
    //     where: { status: 'FINISHED' },
    //     include: {
    //       finalControl: {
    //         where: { result: 'ACCEPT' },
    //       },
    //     },
    //   });

    //   if (_process.length > 0) {
    //     const customerIds = [];
    //     _process.map((item) => {
    //       if (!customerIds.includes(item.customerId)) {
    //         customerIds.push(item.customerId);
    //       }
    //     });
    //     const finishedProcess = [];
    //     if (customerIds.length > 0) {
    //       const data = await Promise.all(
    //         customerIds.map(async (item) => {
    //           const customer = await prisma.customer.findUnique({
    //             where: { id: item },
    //           });
    //           const process = _process.filter((pro) => {
    //             return (
    //               pro.customerId === item &&
    //               pro.invoiceId === null &&
    //               pro.finalControl?.length > 0
    //             );
    //           });

    //           if (process.length > 0) {
    //             finishedProcess.push({ customer, process });
    //           }
    //         }),
    //       );
    //     }
    //     return NextResponse.json(finishedProcess, { status: 200 });
    //   }
    // }

    // const process = await prisma.process.findMany({
    //   include: { technicalParams: true },
    //   orderBy: { createdAt: 'desc' },
    // });
    //return NextResponse.json(process, { status: 200 });

    const processnew = await prisma.$transaction(async (trans) => {
      // Fetch all fault IDs
      const faultsIds = (
        await trans.faultControl.findMany({ select: { id: true } })
      ).map((fault) => fault.id);

      // Fetch processes with technical parameters
      const processes = await trans.process.findMany({
        include: { technicalParams: true },
        orderBy: { createdAt: 'desc' },
      });

      // Fetch fault resources based on fault IDs
      const faultResources = await trans.faultControl.findMany({
        where: {
          id: { in: faultsIds },
        },
      });

      //merge the data of the processes and the faultResources where  they match by ID
      const mergedData = processes.map((p) => ({
        ...p,
        newtechparam: p.technicalDrawingAttachment.concat(
          ';',
          faultResources.find((f) => f.faultId === p.faultId).image,
        ),
      }));
      return mergedData;
    });

    return NextResponse.json(processnew, { status: 200 });
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

// Create  Process
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

    const reqBody: Process | any = await req.json();
    // const faultId = reqBody.faultId;
    const processData = { ...reqBody };

    // delete processData.machineId;
    //delete processData.faultId;

    const newProcess = await prisma.process.create({
      data: {
        ...processData,
        machine: { connect: { id: reqBody.machineId } },
      },
    });

    const updatedMachine = await prisma.machine.update({
      where: { id: reqBody.machineId },
      data: {
        processId: newProcess.id,
      },
    });

    const updatedFault = await prisma.fault.update({
      where: { id: reqBody.faultId },
      data: {
        status: 'PROSES_ISLENIYOR',
      },
    });

    return NextResponse.json(newProcess, { status: 200 });
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
