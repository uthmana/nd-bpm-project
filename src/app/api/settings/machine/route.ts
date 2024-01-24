import { authOptions } from '../../../lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { checkUserRole } from 'utils/auth';

//All Machine
export async function GET(req: NextRequest) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const Machines = await prisma.machine.findMany({
      include: { machineParams: true },
    });
    if (!Machines) {
      throw new Error('No Machine found');
    }
    return NextResponse.json(Machines, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// Create Machine
export async function PUT(req: Request) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const regData = await req.json();
    const createdMachine = await prisma.machine.create({
      data: regData,
    });

    if (!createdMachine) {
      throw new Error('No Machine found');
    }

    return NextResponse.json({ createdMachine }, { status: 200 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Error ocured while creating Machine' },
        { status: 404 },
      );
    }
    return NextResponse.json({
      error: 'Error ocured while creating Machine',
    });
  }
}
