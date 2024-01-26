import { authOptions } from '../../lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

//import prisma  from "../../lib/db1";
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(
      JSON.stringify({ status: 'fail', message: 'You are not logged in' }),
      { status: 401 },
    );
  }

  return NextResponse.json({
    authenticated: !!session,
    session,
  });
}
