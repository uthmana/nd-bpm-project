'use client';
import React, { useEffect, useState } from 'react';
import Dropdown from 'components/dropdown';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { BsArrowBarUp } from 'react-icons/bs';
import NotificationItem from './item';
import { useRouter } from 'next/navigation';
import { getNotifications } from 'app/lib/apiRequest';

export default function Notification({ user }) {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  const getMyNotification = async (user: object) => {
    const { data, status } = await getNotifications(user);
    if (status === 200) {
      setNotifications(data);
      console.log(data);
    }
  };

  useEffect(() => {
    if (user?.role) {
      getMyNotification(user);
    }
  }, [user]);

  const handleNotifClick = (link: string) => {
    router.push(link);
  };

  return (
    <Dropdown
      button={
        <>
          <p className="cursor-pointer">
            <IoMdNotificationsOutline className="h-6 w-6 text-gray-600 dark:text-white" />
          </p>

          {notifications.length > 0 ? (
            <span className="absolute -right-2 -top-3 min-h-fit min-w-fit cursor-pointer rounded-full bg-red-500 px-[4px] py-[2px] text-[12px] font-bold text-white">
              {notifications.length}
            </span>
          ) : null}
        </>
      }
      animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
      classNames={'py-2 top-8 -left-[230px] md:-left-[440px] w-max'}
    >
      <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
        <div className="flex items-center justify-between p-3">
          <p className="text-base font-bold text-navy-700  dark:text-white">
            BİLDİRİMLER {user?.role}
          </p>
        </div>
        {notifications?.map((item, idx) => {
          return (
            <NotificationItem {...item} onClick={handleNotifClick} key={idx} />
          );
        })}
      </div>
    </Dropdown>
  );
}
