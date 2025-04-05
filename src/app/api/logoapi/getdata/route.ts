import { NextResponse } from 'next/server';
import { env } from 'process';
import ApiClient, { ClientInfo } from 'app/lib/logoRequest/request';
import { extractPrismaErrorMessage } from 'utils/prismaError';

export async function GET(req: Request) {
  try {
    const clientinfo: ClientInfo = {
      clientId: env.LOGO_CLIENT_ID,
      clientSecret: env.LOGO_CLIENT_SECRET,
      url: env.LOGO_ENDPOINT,
      firmno: env.LOGO_FIRMANO,
      password: env.LOGO_USERNAME,
      username: env.LOGO_PASSWORD,
    };
    const client = new ApiClient(clientinfo);
    client.requestAccessToken('token');
    const sales = await client.get('salesorders');
    return NextResponse.json(sales);
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
