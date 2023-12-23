import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { token, newPassword } = body;
  if (token && newPassword) {
    //TODO: Do database  update stuff here
    return NextResponse.json(
      { message: 'Password Changed :)' },
      { status: 200 },
    );
  } else {
    return NextResponse.json(
      { message: 'Token is invalid or expired' },
      { status: 404 },
    );
  }
}
