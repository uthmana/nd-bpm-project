'use client';
import React from 'react';
import Dropdown from 'components/dropdown';
import { signOut } from 'next-auth/react';
import avatar from '/public/img/avatars/avatar4.png';
import Image from 'next/image';

export default function Profile({ user }) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/sign-in' });
  };

  return (
    <Dropdown
      key={user?.name}
      button={
        <Image
          width="2"
          height="20"
          className="h-10 w-10 cursor-pointer rounded-full"
          src={avatar}
          alt="Profile"
        />
      }
      classNames={'py-2 top-8 -left-[180px] w-max'}
    >
      <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat pb-5 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
        <div className="ml-4 mt-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              👋 Merhaba, {user?.name}
            </p>
          </div>
        </div>
        <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20 " />
        <div className="ml-4 mt-3 flex flex-col">
          <button
            onClick={handleSignOut}
            className="block text-left text-sm font-medium text-red-500 hover:text-red-500"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </Dropdown>
  );
}
