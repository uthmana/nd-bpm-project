import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import ApiClient, { Clientinfo } from 'utils/logorequests';

export async function PUT(req: Request) {
  try {
    const clientinfo: Clientinfo = {
      clientId: 'AAA',
      clientSecret: 'aaaa=',
      url: 'http://localhost:32001/api/v1',
      firmno: '1111',
      password: 'qq',
      username: 'MISqq',
    };

    const data = {
      INTERNAL_REFERENCE: null,
      GRPCODE: 2,
      TYPE: 8,
      IOCODE: 3,
      NUMBER: 'TEST.FromND',
      DATE: '2024-10-02T00:00:00',

      DOC_NUMBER: 'SİLMEYİN1',

      ARP_CODE: 'S03.014',

      GL_CODE: '320.01.03.014',
      SOURCE_WH: 11,

      CANCELLED: 1,

      PAYMENT_CODE: 'AYS',

      PRINT_COUNTER: 0,

      FICHECNT: 0,
      ACCFICHEREF: 0,
      CREATED_BY: 2,
      DATE_CREATED: '2021-01-02T00:00:00',

      CURRSEL_TOTALS: 1,

      TRANSACTIONS: {
        UPDCURR: 1,
        UPDTRCURR: 1,

        DISP_STATUS: 1,

        SHIP_TIME: 304025907,

        CANCEL_EXP: 'test amaçlı kesilmiştir.',

        VATEXCEPT_REASON: 'bedelsiz',
        TAX_FREE_CHECK: 0,
        TOTAL_NET_STR: 'Sıfır TL',
        IS_OKC_FICHE: 0,
        LABEL_LIST: {},

        EINVOICE: 1,
      },
    };

    const client = new ApiClient(clientinfo);
    client.requestAccessToken('token');
    const sales = await client.post('salesDispatches', data);
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
