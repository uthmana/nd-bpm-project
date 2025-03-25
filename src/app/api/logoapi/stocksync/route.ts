import { Stock } from '@prisma/client';
import { NextResponse } from 'next/server';
import { env } from 'process';
import ApiClient, { ClientInfo } from 'app/lib/logoRequest/request';
import prisma from 'app/lib/db';
import { extractPrismaErrorMessage } from 'utils/prismaError';

export async function POST(req: Request) {
  try {
    const clientinfo: ClientInfo = {
      clientId: env.LOGO_CLIENT_ID,
      clientSecret: env.LOGO_CLIENT_SECRET,
      url: env.LOGO_ENDPOINT,
      firmno: env.LOGO_FIRMANO,
      password: env.LOGO_PASSWORD,
      username: env.LOGO_USERNAME,
    };
    const client = new ApiClient(clientinfo);
    let queryunsafestocks = `Queries/unsafe?tsql=SELECT CODE,NAME,SPECODE FROM LG_${env.LOGO_FIRMANO.toString().padStart(
      3,
      '0',
    )}_ITEMS WHERE ACTIVE=0`;
    const stockresponse = await client.get(queryunsafestocks);
    console.log('Stocks available: ' + stockresponse);
    const filteredItems = {
      first: '',
      next: null, // No more pages to go to
      items: stockresponse.items,
    };

    // Map the Prisma Items and Sync them
    const getStocks = await prisma.stock.findMany();

    // Create a Set of Item codes for fast lookup
    const stockCodes = new Set(getStocks.map((stock) => stock.product_code));

    // Filter out the Items that are not synchronized (those whose code is not in the ItemCodes Set)
    const notSynchedStocks = filteredItems.items.filter((item) => {
      return !stockCodes.has(item.code);
    });

    // Prepare data for bulk insert
    const stocksToCreate: Omit<Stock, 'id'>[] = notSynchedStocks.map(
      (item) => ({
        product_code: item.CODE,
        product_name: item.NAME ?? '',
        unit: 'ADET',
        group1: '',
        group2: '',
        currency: 'TL',
        inventory: 1,
      }),
    );
    console.log('Stocks to insert:', JSON.stringify(stocksToCreate, null, 2));

    // Bulk insert into the database using Prisma
    await prisma.stock.createMany({
      data: stocksToCreate,
      skipDuplicates: true,
    });

    return NextResponse.json(
      {
        'Synched Items': notSynchedStocks.length,
        'Synched Items Codes': notSynchedStocks.map((item) => item.CODE),
      },
      { status: 200 },
    );
  } catch (e) {
    console.error('Prisma Error:', e);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      {
        error: userMessage,
        details: technicalMessage,
      },
      { status: 500 },
    );
  }
}
