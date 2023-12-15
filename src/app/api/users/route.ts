import { NextResponse } from 'next/server';

export async function GET(request: Request, context: any) {
  return NextResponse.json([
    { name: 'Hello', email: 'example@mail.com' },
    { name: 'Nextjs', email: 'example@mail.com' },
  ]);
}
