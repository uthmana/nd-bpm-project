import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';

import prisma from '../../lib/db1';
import { NextAuthOptions } from 'next-auth';
//const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  pages: { signIn: '/auth/sign-in' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },
      //This is where the authentication happens
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        // Check if a user with that user email exists
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        //Checks to see if the password is the same Hashing  compare could be used here with compare lib

        if (!user) {
          throw new Error('user with that email does not exist');
          return null;
        }

        // DO NOT do this in real-world development
        if (user.password !== credentials?.password)
          throw new Error('incorrect password');

        return user;
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET, // store this in a .env file
};
