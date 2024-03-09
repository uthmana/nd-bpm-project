'use client';
// Layout components
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import routes from 'routes';
import {
  getActiveNavbar,
  getActiveRoute,
  isWindowAvailable,
} from 'utils/navigation';
import React from 'react';
import Navbar from 'components/navbar';
import Sidebar from 'components/sidebar';
import Footer from 'components/footer/Footer';
import Breadcrump from 'components/breadcrumb';
import { useSession } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';

export const revalidate = 1;

export default function Admin({ children }: { children: React.ReactNode }) {
  // states and functions
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window?.innerWidth > 1200) setOpen(true);
    const theme = localStorage.getItem('theme');
    if (theme && !document.body.classList.contains(theme)) {
      document.body.classList.add(theme);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser(session?.user);
    }
  }, [session, status]);

  const pathname = usePathname();
  if (isWindowAvailable()) document.documentElement.dir = 'ltr';

  return (
    <div className="flex h-full w-full bg-background-100  dark:bg-background-900">
      <Sidebar
        key={user?.emal}
        user={user}
        routes={routes}
        open={open}
        setOpen={setOpen}
        variant="admin"
      />

      {/* Navbar & Main Content */}
      <div className="h-full w-full font-dm dark:bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-2.5 flex-none transition-all dark:bg-navy-900 
              md:pr-2 ${!open ? 'xl:ml-[0px]' : 'xl:ml-[323px]'}`}
        >
          {/* Routes */}
          <div>
            <Navbar
              key={user?.emal}
              user={user}
              onOpenSidenav={() => setOpen(!open)}
              secondary={getActiveNavbar(routes, pathname)}
            />
            <Breadcrump brandText={getActiveRoute(routes, pathname)} />
            <div className="print:left-0: mx-auto min-h-screen p-2 !pt-[10px] md:p-2 print:absolute print:top-0 print:h-full print:w-full">
              {children}
            </div>

            <div className="p-3 print:hidden">
              <Footer />
            </div>
          </div>
        </main>
      </div>
      <ToastContainer
        className="print:hidden"
        position="bottom-right"
        theme="colored"
      />
    </div>
  );
}
