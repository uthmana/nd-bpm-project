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

    let queryunsafe = `Queries/unsafe?tsql=SELECT CODE AS CODE,DEFINITION_ AS TITLE,ADDR1 AS ADDRESS1,ADDR2 AS ADDRESS2,CITY AS CITY,COUNTRY AS COUNTRY,CARDTYPE AS ACCOUNT_TYPE,POSTCODE AS POSTAL_CODE,TELNRS1 AS TELEPHONE1,TAXNR AS TAX_ID,TAXOFFICE AS TAX_OFFICE,TAXOFFCODE AS TAX_OFFICE_CODE,EMAILADDR AS E_MAIL,TOWN,TOWNCODE AS TOWN_CODE,DISTRICT,DISTRICTCODE,CITYCODE AS CITY_CODE,COUNTRYCODE AS COUNTRY_CODE,DEFINITION2,CELLPHONE,TCKNO,ISPERSCOMP,NAME,SURNAME FROM LG_${env.LOGO_FIRMANO.toString().padStart(
      3,
      '0',
    )}_CLCARD`;

    const allArps = await client.get(queryunsafe);
    const filteredArps = {
      first: allArps[0]?.first,
      next: null, // No more pages to go to
      items: allArps.items,
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
        cardType: 'ALICI_SATICI',
        rep_name: item.TITLE ?? '',
        postalCode: item.POSTAL_CODE,
        phoneNumber: item.TELEPHONE1,
        phoneNumber_shipment: item.TELEPHONE1 ?? '',
        phoneNumber_quality: item.TELEPHONE1 ?? '',
        phoneNumber_accountant: item.TELEPHONE1 ?? '',
        email: item.E_MAIL ?? '',
        email_quality: item.E_MAIL ?? '',
        email_offer: item.E_MAIL ?? '',
        email_accountant: item.E_MAIL ?? '',
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
