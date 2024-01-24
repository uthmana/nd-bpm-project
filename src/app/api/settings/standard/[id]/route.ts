import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import next from 'next';
import { check } from 'prettier';
import { checkUserRole } from 'utils/auth';
import { Standards } from '@prisma/client';

//Get single  standards
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const id = route.params.id;
    const standards: Standards = await prisma.standards.findUnique({
      where: { id: id },
    });
    if (!standards) {
      throw new Error('Fault not found');
    }
    return NextResponse.json(standards, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

//Update  standardss
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const id = route.params.id;

    const resultData: Standards = await req.json();
    if (!resultData) {
      return NextResponse.json({ error: 'Mising required value' });
    }

    const standardsTobeUpdated: Standards = await prisma.standards.findUnique({
      where: { id },
    });
    if (!standardsTobeUpdated) {
      return NextResponse.json({
        error: 'standards to be updated no fould',
      });
    }

    const Updatedstandards: Standards = await prisma.standards.update({
      where: { id },
      data: {
        ...resultData,
      },
    });

    if (!Updatedstandards) {
      return NextResponse.json({ error: 'Error in updating standards' });
    }
    return NextResponse.json(Updatedstandards, { status: 200 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Error ocured while creating standards' },
        { status: 404 },
      );
    }
    return NextResponse.json({
      error: 'Error ocured while creating standards',
    });
  }
}

//Delete  standardss
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const id = route.params.id;
    const standardsToBeDeleted: Standards = await prisma.standards.findUnique({
      where: { id },
    });
    if (!standardsToBeDeleted) {
      return NextResponse.json({
        error: 'standards to be deleted not fould',
      });
    }
    const Deletedstandards: Standards = await prisma.standards.delete({
      where: { id },
    });
    if (!Deletedstandards) {
      return NextResponse.json({
        error: 'Error occured whiles deleting standards',
        status: 401,
      });
    }
    return NextResponse.json(Deletedstandards, { status: 200 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Error ocured while creating standards' },
        { status: 404 },
      );
    }
    return NextResponse.json({
      error: 'Error ocured while creating standards',
    });
  }
}
