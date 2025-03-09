import { Prisma } from '@prisma/client';
import { ClientInfo } from 'app/lib/logoRequest';
import ApiClient from 'app/lib/logoRequest/request';
import { NextResponse } from 'next/server';
import { env } from 'process';

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
      username: env.LOGO_USERNAME,
      password: env.LOGO_PASSWORD,
    };

    const client = new ApiClient(clientinfo);
    await client.requestAccessToken('token');

    const sales = await client.post('salesDispatches', logodata);
    /*************  ✨ Codeium Command 🌟  *************/
    return NextResponse.json({ NUMBER: sales['NUMBER'] }, { status: 200 });
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
