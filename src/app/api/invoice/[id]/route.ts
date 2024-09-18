import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { Fault, Invoice, Prisma, Process, Stock } from '@prisma/client';
import bwipjs from 'bwip-js';
import { cwd } from 'process';
import { postlogoDispatch } from 'app/lib/apiRequest';
import ApiClient, { Clientinfo } from 'utils/logorequests';
//Get single Invoice
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const invoice: Invoice = await prisma.invoice.findUnique({
      where: { id: id },
      include: { process: true, customer: true },
    });
    return NextResponse.json(invoice, { status: 200 });
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

//Update Invoice
export async function PUT(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id = route.params.id;
    const result: any = await req.json();
    const {
      invoiceDate,
      updatedBy,
      customerId,
      tax_Office,
      taxNo,
      process,
      rep_name,
      description,
      totalAmount,
      vat,
      amount,
      address,
      status,
    } = result;

    // Get the customer ID
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    //Create the Logo Object to be posted
    const data = {
      INTERNAL_REFERENCE: null,
      GRPCODE: 2,
      TYPE: 8,
      IOCODE: 3,
      NUMBER: `TEST.FromND1${Date.now}`,
      DATE: '2024-10-02T00:00:00',

      DOC_NUMBER: `SİLMEYİN11${customer.code}`,

      ARP_CODE: 'S.00055', //customer.code

      CANCELLED: 1,

      PRINT_COUNTER: 0,

      CURRSEL_TOTALS: 1,

      TRANSACTIONS: {
        UPDCURR: 1,
        UPDTRCURR: 1,

        DISP_STATUS: 1,

        CANCEL_EXP: 'test amaçlı kesilmiştir.',

        VATEXCEPT_REASON: 'bedelsiz',
        TAX_FREE_CHECK: 0,
        TOTAL_NET_STR: 'Sıfır TL',
        IS_OKC_FICHE: 0,
        LABEL_LIST: {},
      },
    };

    const clientinfo: Clientinfo = {
      clientId: 'dss',
      clientSecret: 'sdsd',
      url: 'fdd',
      firmno: '36',
      password: 'Tsfd',
      username: 'sds',
    };
    const client = new ApiClient(clientinfo);
    client.requestAccessToken('token');
    const sales = await client.post('salesDispatches', data);
    //Log the token
    console.log(sales);
    // Handle Invoice complete
    if (id && status === 'PAID') {
      const invoiceData: any = await prisma.invoice.findUnique({
        where: { id },
        include: { process: true },
      });
      if (invoiceData && invoiceData.status !== 'PAID') {
        const invoice: Invoice = await prisma.invoice.update({
          where: { id: invoiceData.id },
          data: { status },
        });

        if (invoiceData.process && invoiceData.process.length > 0) {
          const stockUpdate = await Promise.all(
            invoiceData.process.map(async (item) => {
              let updatedQty = item.quantity;
              if (item.shipmentQty > item.quantity) {
                updatedQty = 0;
              } else {
                updatedQty = item.quantity - item.shipmentQty;
              }
              const stock = await prisma.stock.update({
                where: { faultId: item.faultId },
                data: { inventory: updatedQty },
              });
            }),
          );

          // await prisma.stock.deleteMany({
          //   where: {
          //     faultId: {
          //       in: faultIds,
          //     },
          //   },
          // });
        }
        return NextResponse.json(invoice, { status: 200 });
      }

      return NextResponse.json(invoiceData, { status: 200 });
    }
    // Handle Invoice complete end

    if (!customerId || !invoiceDate || !tax_Office || !taxNo || !address) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }
    const invoice: Invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    let invoiceBarCode = invoice.barcode;
    if (!invoice.barcode) {
      const barcodeOptions = {
        bcid: 'code128',
        text: invoice.id,
        scale: 3,
      };

      const pngBuffer = await new Promise<Buffer>((resolve, reject) => {
        bwipjs.toBuffer(barcodeOptions, (err, buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(buffer);
          }
        });
      });
      invoiceBarCode = pngBuffer.toString('base64');
    }

    const updateInvoice = await prisma.invoice.update({
      where: {
        id: id,
      },
      data: {
        invoiceDate,
        updatedBy,
        tax_Office,
        taxNo,
        rep_name,
        description,
        totalAmount,
        vat,
        amount,
        address,
        status,
        barcode: invoiceBarCode,
      },
    });

    if (process.length === 0) {
      const processInvoice = await prisma.process.findMany({
        where: { invoiceId: id },
      });

      if (processInvoice?.length > 0) {
        const processUpdate = await Promise.all(
          processInvoice.map(async (item) => {
            const updatedProcess = await prisma.process.update({
              where: {
                id: item.id,
              },
              data: { invoiceId: null },
            });
          }),
        );
      }

      return NextResponse.json(updateInvoice, { status: 200 });
    }

    const processUpdate = await Promise.all(
      process.map(async (item) => {
        const updatedProcess = await prisma.process.update({
          where: {
            id: item.id,
          },
          data: { invoiceId: invoice.id, price: item.price },
        });
      }),
    );

    return NextResponse.json(updateInvoice, { status: 200 });
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

//Delete Invoice
export async function DELETE(
  req: NextRequest,
  route: { params: { id: string } },
) {
  try {
    //TODO: restrict unathorized user : only normal and admin allowed
    const id = route.params.id;
    const deletedInvoice = await prisma.invoice.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(deletedInvoice, { status: 200 });
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
