/*
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '../apiRequest';
import { NextAuthOptions } from 'next-auth';
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';

const isCredentialsCallback = true;
export const authOptions: NextAuthOptions = {
  // ** Please refer to https://next-auth.js.org/configuration/options#providers for more `providers` options
  providers: [
    CredentialsProvider({
      // ** The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      credentials: {},
      async authorize(credentials: any, req) {
        const { email, password } = credentials;
        try {
          const { status, data: user } = await login({ email, password });
          if (status === 200 && user) {
            return user;
          }
          return null;
        } catch {
          throw new Error('Email or Password is invalid');
        }
      },
    }),
  ],

  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // ** 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  // ** Please refer to https://next-auth.js.org/configuration/options#pages for more `pages` options
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-in',
    error: '/404',
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#callbacks for more `callbacks` options
  callbacks: {
    async signIn({ user }) {
      if (isCredentialsCallback) {
        if (user) {
          const sessionToken = randomUUID();
          const sessionExpiry = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000);

          await prisma.session.create({
            data: {
              sessionToken,
              userId: user.id,
              expires: sessionExpiry,
            },
          });

          cookies().set('next-auth.session-token', sessionToken, {
            expires: sessionExpiry,
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        
      //   * For adding custom parameters to user in session, we first need to add those parameters
       //  * in token which then will be available in the `session()` callback
         
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.email = token.email;
        session.user.name = token.name;
      }

      return session;
    },
  },
  events: {
    async signOut({ session }) {
      const { sessionToken = '' } = session as unknown as {
        sessionToken?: string;
      };

      if (sessionToken) {
        await prisma.session.deleteMany({
          where: {
            sessionToken,
          },
        });
      }
    },
  },
};

*/

import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '../apiRequest';
import { NextAuthOptions } from 'next-auth';
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import prisma from '../../lib/db1';

const isCredentialsCallback = true;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials: any, req) {
        const { email, password } = credentials;
        try {
          const { status, data: user } = await login({ email, password });
          if (status === 200 && user) {
            return user;
          }
          return null;
        } catch {
          throw new Error('Email or Password is invalid');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-in',
    error: '/404',
  },
  callbacks: {
    async signIn({ user }) {
      if (isCredentialsCallback && user) {
        const sessionToken = randomUUID();
        const sessionExpiry = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000);

        await prisma.session.create({
          data: {
            sessionToken,
            userId: user.id,
            expires: sessionExpiry,
          },
        });

        cookies().set('next-auth.session-token', sessionToken, {
          expires: sessionExpiry,
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  events: {
    async signOut({ session }) {
      const { sessionToken = '' } = session as { sessionToken?: string };

      if (sessionToken) {
        await prisma.session.deleteMany({
          where: {
            sessionToken,
          },
        });
      }
    },
  },
};
