'use client';
import React from 'react';
import Dropdown from 'components/dropdown';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { BsArrowBarUp } from 'react-icons/bs';

export default function Notification({ user }) {
  return (
    <Dropdown
      button={
        <>
          <p className="cursor-pointer">
            <IoMdNotificationsOutline className="h-6 w-6 text-gray-600 dark:text-white" />
          </p>
          <span className="absolute -right-2 -top-3 min-h-fit min-w-fit cursor-pointer rounded-full bg-red-500 px-[4px] py-[2px] text-[12px] font-bold text-white">
            25
          </span>
        </>
      }
      animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
      classNames={'py-2 top-8 -left-[230px] md:-left-[440px] w-max'}
    >
      <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-navy-700 dark:text-white">
            Notification
          </p>
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            Mark all read
          </p>
        </div>

        <button className="flex w-full items-center">
          <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
            <BsArrowBarUp />
          </div>
          <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
            <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
              New Update for {user?.name}
            </p>
            <p className="font-base text-left text-xs text-gray-900 dark:text-white">
              A new update for your downloaded item is available!
            </p>
          </div>
        </button>

        <button className="flex w-full items-center">
          <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
            <BsArrowBarUp />
          </div>
          <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
            <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
              New Update for {user?.name}
            </p>
            <p className="font-base text-left text-xs text-gray-900 dark:text-white">
              A new update for your downloaded item is available!
            </p>
          </div>
        </button>
      </div>
    </Dropdown>
  );
}
