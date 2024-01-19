import { NextRequest, NextResponse } from 'next/server';
import { checkUserRole } from 'utils/auth';
import { Process } from '@prisma/client';

//Get single process
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }

    const id = route.params.id;
    const process = await prisma.process.findUnique({
      where: { id: id },
      include: { fault: true, machine: true, user: true },
    });
    if (!process.id) return NextResponse.json({ message: 'Process not found' });
    return NextResponse.json(process);
  } catch (error) {
    console.error('Error fetching processs:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Update process
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }

    const id = route.params.id;
    const result: Process = await req.json();
    const { ...data } = result;

    const process: Partial<Process> = await prisma.process.findUnique({
      where: { id },
    });

    if (!process) {
      return NextResponse.json(
        { message: 'process not found.' },
        { status: 404 },
      );
    }

    const updateprocess = await prisma.process.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });
    if (updateprocess) {
      return NextResponse.json({ updateprocess }, { status: 200 });
    }
  } catch (error) {
    console.error('Error updating process', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Delete process
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }

    const id = route.params.id;
    const deletedprocess = await prisma.process.delete({
      where: {
        id: id,
      },
    });
    if (deletedprocess) {
      return NextResponse.json({ deletedprocess }, { status: 200 });
    }
  } catch (error) {
    console.error('Error updating process', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
