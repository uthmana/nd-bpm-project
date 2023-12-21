/* eslint-disable */
import React, { ReactEventHandler, useEffect, useState } from 'react';
import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import NavLink from 'components/link/NavLink';
import DashIcon from 'components/icons/DashIcon';
import SignoutIcon from 'components/icons/SignoutIcon';
import { signOut, useSession } from 'next-auth/react';

type user = {
  name: string;
  email: string;
  role: string;
};

type SessionType = {
  user?: user;
};

// chakra imports

export const SidebarLinks = ({ routes }): JSX.Element => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser(session?.user);
    }
  }, [session, status]);

  // Chakra color mode
  const pathname = usePathname();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName);
    },
    [pathname],
  );

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/sign-in' });
  };

  const createLinks = (routes: RoutesType[], user: user) => {
    return routes.map((route, index) => {
      if (route.role === 'admin' && user?.role !== 'admin') {
        return null;
      }

      return (
        <NavLink key={index} href={route.layout + '/' + route.path}>
          <div className="relative mb-3 flex hover:cursor-pointer">
            <li
              className="my-[3px] flex cursor-pointer items-center px-8"
              key={index}
            >
              <span
                className={`${
                  activeRoute(route.path) === true
                    ? 'font-bold text-brand-500 dark:text-white'
                    : 'font-medium text-gray-600'
                }`}
              >
                {route.icon ? route.icon : <DashIcon />}{' '}
              </span>
              <p
                className={`leading-1 ml-4 flex ${
                  activeRoute(route.path) === true
                    ? 'font-bold text-navy-700 dark:text-white'
                    : 'font-medium text-gray-600'
                }`}
              >
                {route.name}
              </p>
            </li>
            {activeRoute(route.path) ? (
              <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
            ) : null}
          </div>
        </NavLink>
      );
    });
  };
  // BRAND
  return (
    <>
      {createLinks(routes, user)}

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="relative mb-3 flex hover:cursor-pointer"
      >
        <li className="my-[3px] flex cursor-pointer items-center px-8">
          <span className={'font-medium text-gray-600'}>{<SignoutIcon />}</span>
          <p className={'leading-1 ml-4 flex font-medium text-gray-600'}>
            Sign Out
          </p>
        </li>
      </button>
    </>
  );
};

export default SidebarLinks;
