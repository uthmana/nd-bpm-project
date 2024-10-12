import { NextResponse } from 'next/server';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const rolePermissions: Record<string, Record<string, string[]>> = {
      ADMIN: {
        invoice: ['view', 'create', 'edit'],
        customer: ['view', 'create', 'edit'],
        offer: ['view', 'create', 'edit'],
        entry: ['view', 'create', 'edit'],
        liste: ['view', 'create', 'edit'],
        stock: ['view', 'create', 'edit'],
        process: ['view', 'create', 'edit'],
        users: ['view', 'create', 'edit'],
        dashboard: ['view', 'create', 'edit'],
        settings: ['view', 'create', 'edit'],
      },
      SUPER: {
        invoice: ['view', 'create', 'edit'],
        customer: ['view', 'create', 'edit'],
        entry: ['view', 'create', 'edit'],
        liste: ['view', 'create', 'edit'],
        stock: ['view', 'create', 'edit'],
        process: ['view', 'create', 'edit'],
        dashboard: ['view', 'create', 'edit'],
      },
      NORMAL: {
        invoice: ['edit', 'create', 'edit'],
        entry: ['view', 'create', 'edit'],
        liste: ['view', 'create', 'edit'],
        stock: ['view', 'create', 'edit'],
        process: ['view', 'create', 'edit'],
      },
      TECH: {
        entry: ['view', 'create', 'edit'],
        liste: ['view', 'create', 'edit'],
        stock: ['view', 'create', 'edit'],
        process: ['view', 'create', 'edit'],
      },
    };
    // Utility to determine the method (create/edit/view)
    const extractMethod = (pathname: string) => {
      if (pathname.includes('create')) return 'create';
      if (pathname.match(/\/[a-zA-Z0-9]+$/)) return 'edit'; // Matches alphanumeric ID patterns
      return 'view';
    };

    const role: any = req.nextauth.token?.role;

    // If role is undefined or does not exist in userLinks, redirect to a default page
    // Redirect if no role or role is undefined
    if (!role || !rolePermissions[role]) {
      return NextResponse.redirect(new URL('/admin/entry', req.url));
    }

    // Extract module and method from pathname
    const pathSegments = req.nextUrl.pathname.split('/');
    const _module = pathSegments[2]; // Extracts 'entry' from '/admin/entry/[id]'
    const method = extractMethod(req.nextUrl.pathname);

    // Check if role has permission to access the module and method
    const allowedMethods = rolePermissions[role][_module];
    if (!allowedMethods || !allowedMethods.includes(method)) {
      return NextResponse.redirect(new URL('/admin/entry', req.url));
    }

    // Allow access
    return NextResponse.next();
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
