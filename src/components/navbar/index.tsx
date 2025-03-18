'use client';
import React, { useEffect, useState } from 'react';
import { FiAlignJustify } from 'react-icons/fi';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';
import { useSession } from 'next-auth/react';
import Profile from 'components/profile';
import Notification from 'components/notification';

const Navbar = (props: {
  onOpenSidenav: () => void;
  secondary?: boolean | string;
  [x: string]: any;
}) => {
  const { onOpenSidenav } = props;

  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser(session?.user);
    }
  }, [session, status]);

  const handleTheme = () => {
    if (darkmode) {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkmode(false);
    } else {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkmode(true);
    }
  };

  const [darkmode, setDarkmode] = React.useState(
    document.body.classList.contains('dark'),
  );
  return (
    <nav className="sticky top-0 z-40 flex flex-col flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d] print:hidden">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="humburger-menu ml-2 cursor-pointer ">
          <span
            className="flex text-xl text-gray-600 dark:text-white"
            onClick={onOpenSidenav}
          >
            <FiAlignJustify className="h-6 w-6" />
          </span>
        </div>

        <div className="relative mt-2 flex h-[48px] w-[180px] items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
          <Notification user={user} />

          <div className="cursor-pointer text-gray-600" onClick={handleTheme}>
            {darkmode ? (
              <RiSunFill className="h-6 w-6 text-gray-600 dark:text-white" />
            ) : (
              <RiMoonFill className="h-6 w-6 text-gray-600 dark:text-white" />
            )}
          </div>
          <Profile user={user} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
