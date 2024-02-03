import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { checkUserRole } from 'utils/auth';
import { Prisma, Process } from '@prisma/client';

//All  Process
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['TECH', 'ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const result = searchParams.get('result');

    if (status && status === 'finished' && result && result === 'accept') {
      const _process = await prisma.process.findMany({
        where: { status: 'FINISHED' },
        include: {
          finalControl: {
            where: { result: 'ACCEPT' },
          },
        },
      });

      if (_process.length > 0) {
        const customerIds = [];
        _process.map((item) => {
          if (!customerIds.includes(item.customerId)) {
            customerIds.push(item.customerId);
          }
        });
        const finishedProcess = [];
        if (customerIds.length > 0) {
          const data = await Promise.all(
            customerIds.map(async (item) => {
              const customer = await prisma.customer.findUnique({
                where: { id: item },
              });
              const process = _process.filter((pro) => {
                return (
                  pro.customerId === item &&
                  pro.invoiceId === null &&
                  pro.finalControl?.length > 0
                );
              });

              if (process.length > 0) {
                finishedProcess.push({ customer, process });
              }
            }),
          );
        }
        return NextResponse.json(finishedProcess, { status: 200 });
      }
    }

    const process = await prisma.process.findMany({
      include: { technicalParams: true },
    });

    return NextResponse.json(process, { status: 200 });
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
    const allowedRoles = ['TECH'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
    const reqBody: Process = await req.json();
    //TODO: validate reqBody
    const process = await prisma.process.create({
      data: reqBody,
    });

    return NextResponse.json(process, { status: 200 });
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
