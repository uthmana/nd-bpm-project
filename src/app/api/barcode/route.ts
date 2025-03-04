import { NextRequest, NextResponse } from 'next/server';
import bwipjs from 'bwip-js';

export async function POST(req: NextRequest) {
  try {
    const body: any = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { message: 'Please add barcode text' },
        { status: 401 },
      );
    }

    const barcodeOptions = {
      bcid: 'code128',
      text: code,
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
    const invoiceBarCode = pngBuffer.toString('base64');
    console.log({ invoiceBarCode });
    return NextResponse.json({ code: invoiceBarCode }, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
