'use client';

import React from 'react';
import { datesPasted } from '../../utils';

export default function NotificationItem({
  id,
  title,
  description,
  link,
  status,
  onClick,
  createdAt,
}) {
  const handleClick = () => {
    if (onClick) onClick({ link, id });
  };

  return (
    <button className="mb-2 flex w-full items-center" onClick={handleClick}>
      <div className="text-md ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1">
        <p className="mb-1 justify-start text-left  font-bold text-gray-900 dark:text-white">
          {title}
          <span className="ml-3 text-xs text-gray-700">
            {datesPasted(createdAt)} önce
          </span>
        </p>
        <p className="font-base text-left text-xs text-gray-900 dark:text-white">
          {description}
        </p>
      </div>
      <div
        className={`flex h-[12px] w-[12px] items-center justify-center rounded-xl bg-gradient-to-b  text-2xl text-white ${
          status === 'NOT_READ'
            ? 'from-brandLinear to-brand-500'
            : 'from-gray-400 to-gray-700'
        }`}
      ></div>
    </button>
  );
}
