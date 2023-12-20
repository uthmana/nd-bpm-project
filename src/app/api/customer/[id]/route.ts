import { NextResponse } from 'next/server';
import prisma from '../../../lib/db1';
export async function GET(req: Request) {
  try {
    const id = req.url.slice(req.url.lastIndexOf('/') + 1);

    const customerdata: customer = await prisma.customer.findUnique({
      where: { id: Number(id) },
    });
    if (!customerdata.id)
      return NextResponse.json({ message: 'Customer not found' });

    return NextResponse.json(customerdata);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
