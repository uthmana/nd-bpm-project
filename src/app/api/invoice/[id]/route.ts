import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { Fault, Invoice, Prisma, Process, Stock } from '@prisma/client';
import bwipjs from 'bwip-js';
import { cwd } from 'process';
import { postlogoDispatch } from 'app/lib/apiRequest';
import ApiClient, { Clientinfo } from 'utils/logorequests';
import { checkUserRole } from 'utils/auth';
//Get single Invoice
export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const allowedRoles = ['NORMAL', 'ADMIN', 'SUPER'];
    const hasrole = await checkUserRole(allowedRoles);
    if (!hasrole) {
      return NextResponse.json(
        { message: 'Access forbidden' },
        { status: 403 },
      );
    }
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

    if (!customerId || !invoiceDate || !tax_Office || !taxNo || !address) {
      return NextResponse.json(
        { message: 'You are missing a required data' },
        { status: 401 },
      );
    }
    const invoiceData: any = await prisma.invoice.findUnique({
      where: { id },
      include: { process: true },
    });

    if (!invoiceData) {
      return NextResponse.json(
        { message: 'Invoice not found' },
        { status: 404 },
      );
    }

    // Get the customer ID
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    //Create the Logo Object to be posted
    /*
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
    */

    // Handle Invoice complete
    if (id && status === 'PAID') {
      const invoice: Invoice = await prisma.invoice.update({
        where: { id: invoiceData.id },
        data: { status },
      });
      // Update stock
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
      }
      return NextResponse.json(invoice, { status: 200 });
    }

    //Generate barcode
    let invoiceBarCode = invoiceData.barcode;
    if (!invoiceData.barcode) {
      const barcodeOptions = {
        bcid: 'code128',
        text: invoiceData.id,
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

    const { process: invoiceProcess, ...rest } = invoiceData;
    const updateInvoice = await prisma.invoice.update({
      where: {
        id: id,
      },
      data: {
        ...rest,
        barcode: invoiceBarCode,
      },
    });

    //Update Process
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
          data: { invoiceId: invoiceData.id, price: item.price },
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
