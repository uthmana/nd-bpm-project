import { NextResponse } from 'next/server';

export async function GET(request: Request, context: any) {
  return NextResponse.json({ message: 'Hello, Next.js!' });
}
