import { NextResponse } from 'next/server';

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

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;
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
