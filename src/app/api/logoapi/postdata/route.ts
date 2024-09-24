import { Prisma } from '@prisma/client';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import ApiClient, { Clientinfo } from 'utils/logorequests';

export async function PUT(req: Request) {
  try {
    const clientinfo: Clientinfo = {
      clientId: '',
      clientSecret: '',
      url: 'http://localhost:32001/api/v1',
      firmno: '36',
      password: '',
      username: '',
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
    console.log();
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
    var logodata = await req.json();
    console.log(logodata);
    const clientinfo: Clientinfo = {
      clientId: process.env.LOGOCLIENTID,
      clientSecret: process.env.LOGOCLIENTSECRETE,
      url: process.env.LOGOURL,
      firmno: process.env.LOGOFIRMNR,
      password: process.env.LOGOPASSWORD,
      username: process.env.LOGOUSERNAME,
    };

    const client = new ApiClient(clientinfo);
    client.requestAccessToken('token');
    //console.log(client.getacesstoken());
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
