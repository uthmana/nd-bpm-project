import { authOptions } from '../../../lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { checkUserRole } from 'utils/auth';

//All colors
export async function GET(req: NextRequest) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const Colors = await prisma.colors.findMany();
    if (!Colors) {
      throw new Error('No Colors found');
    }
    return NextResponse.json(Colors, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// Create Colors
export async function PUT(req: Request) {
  try {
    //Allow only Admin to make changes
    const allowedRoles = ['ADMIN'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json({ error: 'Access forbidden', status: 403 });
    }
    const regData = await req.json();
    const Colors = await prisma.colors.create({
      data: regData,
    });

    if (!Colors) {
      throw new Error('No Colors found');
    }

    return NextResponse.json({ Colors }, { status: 200 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Error ocured while creating Colors' },
        { status: 404 },
      );
    }
    return NextResponse.json({ error: 'Error ocured while creating Colors' });
  }
}
