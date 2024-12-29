import { Prisma } from '@prisma/client';
import NextAuth from 'next-auth/next';
import { NextResponse } from 'next/server';
import ApiClient, { AccessTokenResponse, Clientinfo } from 'utils/logorequests';

export async function GET(req: Request) {
  try {
    /*
    const clientinfo: Clientinfo = {
      clientId: 'cc',
      clientSecret: 'cc',
      url: 'http://localhost:32001/api/v1',
      firmno: '1111',
      password: '123',
      username: '456',
    };
    */
    const clientinfo: Clientinfo = {
      clientId: 'AYZ',
      clientSecret: '5AGTu3agfs/lBm3+7TuB5WkZrdsMo00z6lLcz96ntEw=',
      url: 'http://localhost:32003/api/v1',
      firmno: '50',
      password: 'TOA013',
      username: 'MIS',
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
