import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '../apiRequest';
import { NextAuthOptions } from 'next-auth';

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
    async jwt({ token, user }) {
      if (user) {
        /*
         * For adding custom parameters to user in session, we first need to add those parameters
         * in token which then will be available in the `session()` callback
         */
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.id = token.id as string;
      }

      return session;
    },
  },
};
