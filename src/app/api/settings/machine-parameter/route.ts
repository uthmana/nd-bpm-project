import { authOptions } from '../../../lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { checkUserRole } from 'utils/auth';

//All machineParams
export async function GET(req: NextRequest) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const machineParamss = await prisma.machineParams.findMany();
    if (!machineParamss) {
      throw new Error('No machineParams found');
    }
    return NextResponse.json(machineParamss, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// Create machineParams
export async function PUT(req: Request) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const regData = await req.json();
    const createdmachineParams = await prisma.machineParams.create({
      data: regData,
    });

    if (!createdmachineParams) {
      throw new Error('No machineParams found');
    }

    return NextResponse.json({ createdmachineParams }, { status: 200 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Error ocured while creating machineParams' },
        { status: 404 },
      );
    }
    return NextResponse.json({
      error: 'Error ocured while creating machineParams',
    });
  }
}
