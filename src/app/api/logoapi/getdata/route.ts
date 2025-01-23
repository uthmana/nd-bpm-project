import { Prisma } from '@prisma/client';
import NextAuth from 'next-auth/next';
import { NextResponse } from 'next/server';
import { env } from 'process';
import ApiClient, { AccessTokenResponse, ClientInfo } from 'utils/logorequests';

export async function GET(req: Request) {
  try {
    const clientinfo: ClientInfo = {
      clientId: env.LOGO_CLIENT_ID,
      clientSecret: env.LOGO_CLIENT_SECRET,
      url: env.LOGO_ENDPOINT,
      firmno: env.LOGO_FIRMANO,
      password: env.LOGO_USERNAME,
      username: env.LOGO_PASSWORD,
    };
    const client = new ApiClient(clientinfo);
    client.requestAccessToken('token');
    const sales = await client.get('salesorders');
    return NextResponse.json(sales);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientRustPanicError
    ) {
      return NextResponse.json(e, { status: 403 });
    }
    return NextResponse.json(e, { status: 500 });
  }
}
