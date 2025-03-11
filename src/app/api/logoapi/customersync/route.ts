import { Prisma } from '@prisma/client';
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
    const queryClientCards = 'Arps?withCount=true';
    const response = await client.get(queryClientCards);
    const totalItems = response.totalCount; // Total number of items available
    let query =
      'Arps?offset=0&limit=25&q=RECORD_STATUS eq 0&fields=RECORD_STATUS,ACCOUNT_TYPE,CODE,TITLE,ADDRESS1,ADDRESS2,TOWN_CODE,TOWN,CITY_CODE,CITY,COUNTRY_CODE,COUNTRY,POSTAL_CODE,TELEPHONE1,TELEPHONE1_CODE,TAX_ID,TAX_OFFICE,TAX_OFFICE_CODE,CONTACT,E_MAIL,ITR_SEND_MAIL_ADR,POST_LABEL,SENDER_LABEL,FBS_SEND_EMAILADDR,FBA_SEND_EMAILADDR';
    let allArps = [];
    let next = query; // Initial query for the first page
    let fetchedItems = 0; // Track the number of items fetched

    // Loop to continue fetching data until all items are fetched or no more 'next' page
    while (next && fetchedItems < totalItems) {
      const Arps = await client.get(next); // Fetch data for the current page
      allArps = [...allArps, ...Arps.items]; // Add the items to the collection
      fetchedItems += Arps.items.length; // Update the number of fetched items

      // If there's a 'next' page, update 'next' with the URL to continue fetching
      if (Arps.next) {
        const parsedUrl = new URL(Arps.next.href);
        const relativePath = parsedUrl.pathname.replace('/api/v1', '');
        next = relativePath + parsedUrl.search; // Update next with relative path and query params
      } else {
        next = null; // No more pages to fetch
      }
    }

    //CardType Mapping
    const cardtypes = { '1': 'ALICI', '2': 'SATICI', '3': 'ALICI_SATICI' };

    // Remove 'Meta' and other info not needed from each item
    const filteredItems = allArps.map(
      ({
        Meta,
        GENIUSFLDSLIST,
        DEFNFLDSLIST,
        NOTES,
        ACCOUNT_TYPE,
        ...rest
      }) => ({
        ...rest, // Spread remaining properties correctly
        ACCOUNT_TYPE: cardtypes[ACCOUNT_TYPE.toString()] || 'ALICI_SATICI', // Default to 'ALICI_SATICI' if missing
      }),
    );

    const filteredArps = {
      first: allArps[0]?.first,
      next: null, // No more pages to go to
      items: filteredItems,
    };

    // Map the Prisma Customers and Sync them
    const getCustomers = await prisma.customer.findMany();

    // Create a Set of customer codes for fast lookup
    const customerCodes = new Set(
      getCustomers.map((customer) => customer.code),
    );

    // Filter out the customers that are not synchronized (those whose code is not in the customerCodes Set)
    const notSynchedCustomers = filteredArps.items.filter((item) => {
      return !customerCodes.has(item.code);
    });

    // Prepare data for bulk insert
    const customersToCreate: Prisma.CustomerCreateManyInput[] =
      notSynchedCustomers.map((item) => ({
        country_code: item.COUNTRY_CODE ?? '',
        province_code: item.TOWN_CODE ?? '',
        district_code: item.CITY_CODE ?? '',
        code: item.CODE,
        company_name: item.TITLE ?? '',
        address: item.ADDRESS1 ?? '',
        taxNo: item.TAX_ID ?? '',
        tax_Office: item.TAX_OFFICE,
        cardType: item.ACCOUNT_TYPE,
        rep_name: item.TITLE ?? '',
        postalCode: item.POSTAL_CODE,
        phoneNumber: item.TELEPHONE1,
        phoneNumber_shipment: item.TELEPHONE1 ?? '',
        phoneNumber_quality: item.TELEPHONE1 ?? '',
        phoneNumber_accountant: item.TELEPHONE1 ?? '',
        email: item.E_MAIL ?? '',
        email_quality: item.SENDER_LABEL ?? '',
        email_offer: item.FBA_SEND_EMAILADDR ?? '',
        email_accountant: item.FBA_SEND_EMAILADDR ?? '',
        taxOfficeCode: item.TAX_OFFICE_CODE ?? '',
        currency: 'TL',
      }));

    // Bulk insert into the database using Prisma
    await prisma.customer.createMany({
      data: customersToCreate,
      skipDuplicates: true, // Avoid inserting duplicates if they already exist
    });

    return NextResponse.json(
      {
        'Not Synched Clients': notSynchedCustomers.length, // Total Not Synched Clients
        'Synched Clients Codes': notSynchedCustomers.map((item) => item.CODE), // Non-synched client codes
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
