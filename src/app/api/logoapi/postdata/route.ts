import { Prisma } from '@prisma/client';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { env } from 'process';
import ApiClient, { Clientinfo } from 'utils/logorequests';

export async function PUT(req: Request) {
  try {
    const resp = req.json();

    const clientinfo: Clientinfo = {
      clientId: env.LOGO_CLIENT_ID, // 'AYZ',
      clientSecret: env.LOGO_CLIENT_SECRET, // '5AGTu3agfs/lBm3+7TuB5WkZrdsMo00z6lLcz96ntEw=',
      url: env.LOGO_ENDPOINT, // 'http://localhost:32001/api/v1',
      firmno: env.LOGO_FIRMANO,
      password: env.LOGO_PASSWORD,
      username: env.LOGO_USERNAME,
    };

    console.log(clientinfo);

    const client = new ApiClient(clientinfo);
    client.requestAccessToken('token');
    console.log(client.getacesstoken());
    const sales = await client.post('salesDispatches', resp['data']);
    return NextResponse.json(sales);
  } catch (e) {
    console.log({ e });
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

export async function POST(req: Request) {
  try {
    var logodata = await req.json();

    const clientinfo: Clientinfo = {
      clientId: env.LOGO_CLIENT_ID, // 'AYZ',
      clientSecret: env.LOGO_CLIENT_SECRET, // '5AGTu3agfs/lBm3+7TuB5WkZrdsMo00z6lLcz96ntEw=',
      url: env.LOGO_ENDPOINT, // 'http://localhost:32001/api/v1',
      firmno: env.LOGO_FIRMANO,
      password: env.LOGO_USERNAME,
      username: env.LOGO_PASSWORD,
    };

    console.log(clientinfo);

    const client = new ApiClient(clientinfo);
    client.requestAccessToken('token');
    console.log(client.getacesstoken());
    const sales = await client.post('salesDispatches', logodata);
    return NextResponse.json(sales);
  } catch (e) {
    console.log({ e });
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
