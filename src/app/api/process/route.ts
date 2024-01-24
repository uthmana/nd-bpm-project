import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';
import { hash } from 'bcryptjs';
import { checkUserRole } from 'utils/auth';
import { Process, User } from '@prisma/client';

//All  Process
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['TECH'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const process = await prisma.process.findMany({
      include: { technicalParams: true },
    });
    if (!process) {
      throw new Error('User not found');
    }
    return NextResponse.json(process, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

// Create  Process
export async function PUT(req: Request) {
  try {
    const allowedRoles = ['TECH'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const reqBody: Process = await req.json();
    //TODO: validate reqBody
    const process = await prisma.process.create({
      data: reqBody,
    });

    if (!process) {
      throw new Error('Process not found');
    }
    return NextResponse.json(process, { status: 200 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Error ocured while creating process' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
