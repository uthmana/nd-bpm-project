import { NextResponse } from 'next/server';
import prisma from 'app/lib/db1';
import { compare } from 'bcryptjs';

// ** Fake user data
// ** Please remove below user data in production and verify user with Real Database
const users = [
  {
    id: '1',
    name: 'Joe Murat',
    email: 'admin@mail.com',
    password: 'admin',
    role: 'admin',
    status: true,
    date: '12/12/2023',
    edit: '1',
    delete: '1',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'super@mail.com',
    password: 'super',
    role: 'super',
    status: true,
    date: '12/12/2023',
    edit: '2',
    delete: '2',
  },
  {
    id: '3',
    name: 'Erdem Max',
    email: 'normal@mail.com',
    password: 'normal',
    role: 'normal',
    status: true,
    date: '12/12/2023',
    edit: '3',
    delete: '3',
  },
  {
    id: '4',
    name: 'Samet Yıldırım',
    email: 'tech@mail.com',
    password: 'tech',
    role: 'tech',
    status: true,
    date: '12/12/2023',
    edit: '4',
    delete: '4',
  },
];
/*
export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;
  //TODO: query database for the user
  //Compare password
  //Check for active user
  //Create user token

  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    return NextResponse.json(user, { status: 200 });
  } else {
    return NextResponse.json(
      { message: 'Email or Password is invalid' },
      { status: 404 },
    );
  }
}
*/

export async function POST(req: Request) {
  try {
    const { email, password }: Partial<User> = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const passwordMatch = await compare(password, user.password);

      if (passwordMatch) {
        // Passwords match, return success
        return NextResponse.json(user, { status: 200 });
      } else {
        // Passwords don't match
        return NextResponse.json(
          { message: 'Email or password is incorrect' },
          { status: 401 },
        );
      }
    } else {
      // User not found
      return NextResponse.json(
        { message: 'Email or password is incorrect' },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
