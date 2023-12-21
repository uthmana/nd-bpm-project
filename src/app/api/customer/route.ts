import { NextRequest, NextResponse } from 'next/server';

import prisma from '../../lib/db1';

export async function POST(req: Request) {
  try {
    const { name, email, password, roleId, PostalCode, adress, phoneNumber } =
      await req.json();
    if (
      !name ||
      !roleId ||
      !email ||
      !password ||
      !PostalCode ||
      !adress ||
      !phoneNumber
    ) {
      return NextResponse.json({ message: 'You are missing a required data' });
    }
    const newCustomer = await prisma.customer.create({
      data: {
        name: name,
        email: email,
        password: password,
        roleId: roleId,
        PostalCode: PostalCode,
        adress: adress,
        phoneNumber: phoneNumber,
      },
    });

    return NextResponse.json({ message: `Created ${name} customer` });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

export async function GET(req: NextRequest) {
  try {
    const customerdata: customer[] = await prisma.customer.findMany();
    return NextResponse.json(customerdata);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

export async function DELETE(req: Request) {
  const { id }: Partial<customer> = await req.json();

  if (!id) return NextResponse.json({ message: 'customer id required' });

  const res = await prisma.customer.delete({ where: { id } });
  return NextResponse.json({ message: `customer ${id} deleted` });
}

export async function PUT(req: Request) {
  try {
    const result: User = await req.json();
    if (!result.name || !result.roleId || !result.email || !result.password) {
      return NextResponse.json({ message: 'You are missing a required data' });
    }
    const { name, email, password, roleId, id } = result;
    const newUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        password,
        roleId,
      },
    });

    return NextResponse.json({ message: `Updated ${name} customer ` });
  } catch (error) {
    console.error('Error updating user', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
