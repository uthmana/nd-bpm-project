import { authOptions } from '../../../lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { checkUserRole } from 'utils/auth';

//All standards
export async function GET(req: NextRequest) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const standardss = await prisma.standards.findMany();
    if (!standardss) {
      throw new Error('No standards found');
    }
    return NextResponse.json(standardss, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// Create standards
export async function PUT(req: Request) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const regData = await req.json();
    const createdstandards = await prisma.standards.create({
      data: regData,
    });

    if (!createdstandards) {
      throw new Error('No standards found');
    }

    return NextResponse.json({ createdstandards }, { status: 200 });
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
