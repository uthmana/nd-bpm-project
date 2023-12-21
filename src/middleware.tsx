import { NextResponse } from 'next/server';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    if (
      (req.nextUrl.pathname.startsWith('/admin/offer') ||
        req.nextUrl.pathname.startsWith('/admin/users') ||
        req.nextUrl.pathname.startsWith('/admin/settings')) &&
      req.nextauth.token?.role !== 'admin'
    ) {
      return NextResponse.rewrite(new URL('/denied', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ['/admin/:path*'],
};
