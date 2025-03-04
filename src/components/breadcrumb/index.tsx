import React from 'react';

export default function Breadcrump(props: { brandText: string }) {
  const { brandText } = props;

  return (
    <div className="ml-[12px]">
      <div className="h-6 w-[224px] pt-1">
        <a
          className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
          href=" "
        >
          Sayfa
          <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
            {' '}
            /{' '}
          </span>
        </a>
        <a
          className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
          href="#"
        >
          {brandText}
        </a>
      </div>
      <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
        <span className="font-bold capitalize hover:text-navy-700 dark:hover:text-white">
          {brandText}
        </span>
      </p>
    </div>
  );
}
