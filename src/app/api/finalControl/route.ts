import { NextRequest, NextResponse } from 'next/server';
import prisma from 'app/lib/db';
import { FinalControl } from '@prisma/client';
import { checkUserRole } from 'utils/auth';

//All Final Controls
export async function GET(req: NextRequest) {
  try {
    const allowedRoles = ['SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const finalControl = await prisma.finalControl.findMany();
    if (!finalControl) {
      throw new Error('No finalControl found');
    }
    return NextResponse.json(finalControl, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
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
    const result: FinalControl = await req.json();
    const { faultId, result: controlReult, processId } = result;

    if (!faultId || !controlReult || !processId) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }

    const finalControl = await prisma.finalControl.create({
      data: result,
    });

    if (!finalControl) {
      throw new Error('Error occuried while creating form control');
    }

    //Create Notification
    const notification = await prisma.notification.create({
      data: {
        title: 'Ürün Final Kontrolü',
        description: 'Yeni bir ürün final kontrolu yapıldı',
        receiver: 'OTHER',
        link: `/admin/process/control/${finalControl.id}`,
      },
    });

    return NextResponse.json(finalControl, { status: 200 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Error ocured while creating final control' },
        { status: 404 },
      );
    }
    return NextResponse.json({
      error: 'Error ocured while creating final control',
    });
  }
}
