'use client';
import React, { useEffect, useState } from 'react';
import Dropdown from 'components/dropdown';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { BsArrowBarUp } from 'react-icons/bs';
import NotificationItem from './item';
import { useRouter } from 'next/navigation';
import { getNotifications, updateNotificStatus } from 'app/lib/apiRequest';

export default function Notification({ user }) {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  const getMyNotification = async () => {
    const { data, status } = await getNotifications();
    if (status === 200) {
      setNotifications(data);
    }
  };

  useEffect(() => {
    if (user?.role) {
      getMyNotification();
    }
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      getMyNotification();
    }, 20000);

    () => {
      clearInterval(timer);
    };
  }, []);

  const handleNotifClick = async ({ id, link }) => {
    const { status, data } = await updateNotificStatus({ id });
    if (status === 200) {
      getMyNotification();
      router.push(link);
    }
  };

  return (
    <Dropdown
      button={
        <>
          <p className="cursor-pointer">
            <IoMdNotificationsOutline className="h-6 w-6 text-gray-600 dark:text-white" />
          </p>

          {notifications.length > 0 ? (
            <span className="absolute -right-2 -top-3 flex h-[20px] min-h-fit w-[20px] min-w-fit cursor-pointer items-center justify-center rounded-full bg-red-500 p-[2px] text-[12px] font-bold text-white">
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
            BİLDİRİMLER
          </p>
        </div>
        {notifications.length === 0 ? (
          <div className="w-full p-4 text-center capitalize">
            Okunmamış bildirim yok
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto pr-3 md:max-h-[800px]">
            {notifications?.map((item, idx) => {
              return (
                <NotificationItem
                  {...item}
                  onClick={(val) => handleNotifClick(val)}
                  key={idx}
                />
              );
            })}
          </div>
        )}
      </div>
    </Dropdown>
  );
}
