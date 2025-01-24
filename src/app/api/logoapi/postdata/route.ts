import { Prisma } from '@prisma/client';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { env } from 'process';
import ApiClient, { ClientInfo } from 'utils/logorequests';

export async function PUT(req: Request) {
  try {
    const resp = await req.json();

    const clientinfo: ClientInfo = {
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
    console.log(client.getAccessToken());
    console.log(resp['data']);
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
/*************  ✨ Codeium Command 🌟  *************/

export async function POST(req: Request) {
  try {
    var logodata = await req.json();

    const clientinfo: ClientInfo = {
      clientId: env.LOGO_CLIENT_ID,
      clientSecret: env.LOGO_CLIENT_SECRET,
      url: env.LOGO_ENDPOINT,
      firmno: env.LOGO_FIRMANO,
      password: env.LOGO_USERNAME,
      username: env.LOGO_PASSWORD,
    };

    const client = new ApiClient(clientinfo);
    await client.requestAccessToken('token');

    const sales = await client.post('salesDispatches', logodata);
    const number = sales['NUMBER'];
    /*************  ✨ Codeium Command 🌟  *************/
    return NextResponse.json(number, { status: 200 });
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
