import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { env } from 'process';
import ApiClient, { ClientInfo } from 'app/lib/logoRequest/request';
import prisma from 'app/lib/db';

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
    const queryClientCards =
      'Items?withCount=true&q=RECORD_STATUS eq 0 AND CARD_TYPE eq 1';
    const response = await client.get(queryClientCards);
    const totalItems = response.totalCount; // Total number of items available
    let query =
      'Items?offset=0&limit=25&q=RECORD_STATUS eq 0 AND CARD_TYPE eq 1';
    let allItems = [];
    let next = query; // Initial query for the first page
    let fetchedItems = 0; // Track the number of items fetched

    // Loop to continue fetching data until all items are fetched or no more 'next' page
    while (next && fetchedItems < totalItems) {
      const Items = await client.get(next); // Fetch data for the current page
      allItems = [...allItems, ...Items.items]; // Add the items to the collection
      fetchedItems += Items.items.length; // Update the number of fetched items

      // If there's a 'next' page, update 'next' with the URL to continue fetching
      if (Items.next) {
        const parsedUrl = new URL(Items.next.href);
        const relativePath = parsedUrl.pathname.replace('/api/v1', '');
        next = relativePath + parsedUrl.search; // Update next with relative path and query params
      } else {
        next = null; // No more pages to fetch
      }
    }

    // Now allItemss contains all the records from paginated responses

    // Remove 'Meta' and other info not needed from each item
    const deconstructedItems = allItems.map(
      ({
        Meta,
        FACTORY_PARAMS,
        DEFNFLDSLIST,
        WH_PARAMS,
        ADDTAXLIST,
        QPRODSUBCONTS,
        GENIUSFLDSLIST,
        VRNTEXCEPTIONS,
        VRNTCODETEMPS,
        ALTERNATIVES,
        UNITS,
        COMPOSITES,
        GL_LINKS,
        SUPPLIERS,
        CHARACTERISTICS,
        DOMINANT_CLASSES,
        VRNTEXCPTEMPS,
        LABEL_LIST,
        QPRODS,
        ...rest
      }) => ({
        ...rest, // Spread remaining properties correctly
      }),
    );

    const filteredItems = {
      first: allItems[0]?.first,
      next: null, // No more pages to go to
      items: deconstructedItems,
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
    const stocksToCreate: Prisma.StockCreateManyInput[] = notSynchedStocks.map(
      (item) => ({
        product_code: item.CODE,
        product_name: item.NAME ?? '',
        unit: item.MAINUNIT,
        group1: '',
        group2: '',
        currency: 'TL',
        current_price: '100',
      }),
    );

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
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientRustPanicError
    ) {
      console.error('Prisma Error:', e);
      return NextResponse.json({ message: e.message }, { status: 403 });
    }

    console.error('Unknown Error:', e);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
