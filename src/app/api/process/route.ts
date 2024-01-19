import { NextRequest, NextResponse } from 'next/server';
import { checkUserRole } from 'utils/auth';
import { Process } from '@prisma/client';

//All process
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const process = await prisma.process.findMany({
      include: { fault: true, machine: true, user: true },
    });
    if (!process) {
      throw new Error('process not found');
    }
    return NextResponse.json(process, { status: 200 });
  } catch (error) {
    console.error('Error fetching process:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

// Create process
export async function PUT(req: Request) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }

    const result: Process = await req.json();

    const { ...data } = result;
    const process = await prisma.process.create({
      data: {
        ...data,
      },
    });
    return NextResponse.json({ process }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error ocured while creating process' });
  }
}
