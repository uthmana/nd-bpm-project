'use client';
import React, { useEffect, useRef, useState } from 'react';
import Dropdown from 'components/dropdown';
import { IoMdNotificationsOutline } from 'react-icons/io';
import NotificationItem from './item';
import { useRouter } from 'next/navigation';
import { getNotifications, updateNotification } from 'app/lib/apiRequest';
import { convertToISO8601, log } from 'utils';
import { useSession } from 'next-auth/react';

export default function Notification({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { data: session } = useSession();
  const [activeNotification, setActiveNotification] = useState(0);

  const getMyNotification = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const userQuery = `?role=${session?.user?.role}&time=${convertToISO8601(
        thirtyDaysAgo,
      )}`;
      log(userQuery);
      const { data } = await getNotifications(userQuery);
      setNotifications(data);
      setActiveNotification(
        data?.filter((item) => item.status !== 'READ')?.length,
      );
    } catch (err) {
      log('getMyNotification', err);
    }
  };

  useEffect(() => {
    if (!session?.user?.role) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    getMyNotification();

    intervalRef.current = setInterval(() => {
      getMyNotification();
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [session?.user?.role]);

  const handleNotifClick = async ({ id, link }) => {
    try {
      const user = [...notifications]?.find((item) => item.id === id);
      if (
        !user ||
        user?.status === 'READ' ||
        user?.recipient !== session?.user?.role
      ) {
        router.push(link);
        return;
      }

      await updateNotification({ ids: [id] });
      getMyNotification();
      router.push(link);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const users = [...notifications]?.filter(
        (item) =>
          item.status !== 'READ' && item.recipient === session?.user?.role,
      );
      if (!users?.length) {
        return;
      }

      const ids = users.map((item) => item.id);
      await updateNotification({ ids });
      getMyNotification();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dropdown
      open={isOpen}
      button={
        <>
          <p className="cursor-pointer">
            <IoMdNotificationsOutline className="h-6 w-6 text-gray-600 dark:text-white" />
          </p>

          {activeNotification ? (
            <span className="absolute -right-2 -top-3 flex h-[20px] min-h-fit w-[20px] min-w-fit cursor-pointer items-center justify-center rounded-full bg-red-500 p-[2px] text-[12px] font-bold text-white">
              {activeNotification}
            </span>
          ) : null}
        </>
      }
      animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
      classNames={'py-2 top-8 -left-[230px] md:-left-[440px] w-max'}
    >
      <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
        <div className="flex items-center justify-between border-b p-3">
          <p className="text-base font-bold text-navy-700  dark:text-white">
            BİLDİRİMLER
          </p>
          {activeNotification ? (
            <button
              className="text-xs font-bold capitalize underline opacity-70 hover:opacity-100"
              onClick={handleMarkAllRead}
            >
              Tümünü okundu olarak imle
            </button>
          ) : null}
        </div>
        {notifications.length === 0 ? (
          <div className="w-full p-4 text-center capitalize opacity-70">
            Okunmamış bildirim yok
          </div>
        ) : (
          <div className="!md:max-h-[800px] max-h-[400px] overflow-y-auto pr-3">
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
