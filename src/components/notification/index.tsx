'use client';
import React, { useEffect, useRef, useState } from 'react';
import Dropdown from 'components/dropdown';
import { IoMdNotificationsOutline } from 'react-icons/io';
import NotificationItem from './item';
import { useRouter, usePathname } from 'next/navigation';
import {
  getNotifications,
  sendNotification,
  updateNotification,
} from 'app/lib/apiRequest';
import { convertToISO8601, log } from 'utils';
import { useSession } from 'next-auth/react';

export default function Notification({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [activeNotification, setActiveNotification] = useState(0);
  const [olderNotifications, setOlderNotifictions] = useState([]);

  const filterOlderNotifications = (data) => {
    if (!data) return;
    const now = new Date();
    return data.filter((item) => {
      const createdAt = new Date(item.createdAt);
      return now.getTime() - createdAt.getTime() > 180 * 60 * 1000;
    });
  };

  const sendEmailNotification = async (data) => {
    if (!data) return;
    await Promise.all(
      data.map((item) =>
        sendNotification({
          workflowId: 'entry-unattended',
          data: item,
        }),
      ),
    );
  };

  const getMyNotification = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const userQuery = `?role=${session?.user?.role}&time=${convertToISO8601(
        thirtyDaysAgo,
      )}`;

      const { data } = await getNotifications(userQuery);
      let filteredNotifications = data;

      if (session?.user?.role === 'ADMIN') {
        const adminNotifications = data.filter(
          (item) => item.recipient === 'ADMIN',
        );
        const otherNotifications = data.filter(
          (item) => item.recipient !== 'ADMIN',
        );
        const filteredOlderNotifications =
          filterOlderNotifications(otherNotifications);
        filteredNotifications = [
          ...adminNotifications,
          ...filteredOlderNotifications,
        ];
        setOlderNotifictions(filteredOlderNotifications);
      } else {
        filteredNotifications = data?.filter(
          (item) => item.recipient === session?.user?.role,
        );

        const filteredOlderNotifications = filterOlderNotifications(
          filteredNotifications,
        );
        const unreadOlderNotification = filteredOlderNotifications?.filter(
          (item) => item.status === 'NOT_READ' && !item.isEmailSent,
        );
        if (unreadOlderNotification?.length) {
          sendEmailNotification(unreadOlderNotification);
        }
      }
      setNotifications(filteredNotifications);
      setActiveNotification(
        filteredNotifications?.filter((item) => item.status !== 'READ')?.length,
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

  useEffect(() => {
    const onUpdateNotification = async () => {
      const fullpath = `${window.location.origin}${pathname}`;
      const notificationDetail = notifications?.filter(
        (item) =>
          fullpath === item.link &&
          item.status !== 'READ' &&
          item.recipient === session?.user?.role,
      );
      if (notificationDetail?.length) {
        const ids = notificationDetail.map((item) => item.id);
        await updateNotification({ ids });
        getMyNotification();
      }
    };

    if (!session?.user?.role || !notifications) return;
    onUpdateNotification();
  }, [pathname, notifications, session]);

  const handleNotifClick = async ({ id, link }) => {
    try {
      const user = [...notifications]?.find((item) => item.id === id);
      const otherUser = olderNotifications?.find((item) => item.id === user.id);
      if (otherUser && !otherUser?.isEmailSent) {
        sendEmailNotification([otherUser]);
        router.push(link);
        return;
      }
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

  const getOtherNotificationType = (id) => {
    if (!olderNotifications.length) return '';
    const olderNotific = olderNotifications.find((item) => item.id === id);
    if (olderNotific) {
      return 'other';
    }
    return '';
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
              {activeNotification > 9 ? '9+' : activeNotification}
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
                  key={idx}
                  {...item}
                  type={getOtherNotificationType(item.id)}
                  onClick={(val) => handleNotifClick(val)}
                />
              );
            })}
          </div>
        )}
      </div>
    </Dropdown>
  );
}
