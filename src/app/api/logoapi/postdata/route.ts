import { Prisma } from '@prisma/client';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import ApiClient, { Clientinfo } from 'utils/logorequests';

export async function PUT(req: Request) {
  try {
    const clientinfo: Clientinfo = {
      clientId: 'AYZ',
      clientSecret: '5AGTu3agfs/lBm3+7TuB5WkZrdsMo00z6lLcz96ntEw=',
      url: 'http://localhost:32001/api/v1',
      firmno: '36',
      password: 'TOA013',
      username: 'MIS',
    };
    /*
    const data = {
      INTERNAL_REFERENCE: null,
      TYPE: 8,
      NUMBER: 'TEST.FromND1',
      DATE: '2024-10-02T00:00:00',

      DOC_NUMBER: 'SİLMEYİN11',

      ARP_CODE: 'S.00055',

      TRANSACTIONS: {
        CANCEL_EXP: 'test amaçlı kesilmiştir.',

        LABEL_LIST: {},
      },
    };*/
    const resp = req.json();
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
    const clientinfo: Clientinfo = {
      clientId: 'AYZ',
      clientSecret: '5AGTu3agfs/lBm3+7TuB5WkZrdsMo00z6lLcz96ntEw=',
      url: 'http://localhost:32001/api/v1',
      firmno: '36',
      password: 'TOA013',
      username: 'MIS',
    };

    console.log(req);

    const resp = req.json();
    console.log(req.json());

    const client = new ApiClient(clientinfo);
    client.requestAccessToken('token');
    console.log(client.getacesstoken());
    console.log(resp);
    const sales = await client.post('salesDispatches', resp);
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
