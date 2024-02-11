'use client';
import React from 'react';
import NextLink from 'next/link';
import { MdOutlineArrowForward } from 'react-icons/md';
import Card from 'components/card';

export default function DetailHeader(props: {
  title: string;
  seeAllLink?: string;
  seeAllText?: string;
  actionLink?: string;
  actionText?: string;
}) {
  const {
    title,
    seeAllLink,
    seeAllText,
    actionLink,
    actionText = 'Düzenle',
  } = props;
  return (
    <Card extra="flex mb-3 min-h-[72px] !rounded-[0px] items-center !flex-row w-full px-3 justify-between">
      <h2 className="w-fit text-2xl">{title} </h2>
      <div className="flex flex-nowrap items-center gap-3 py-4">
        {actionLink ? (
          <NextLink
            href={actionLink}
            className="text-md flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 font-bold text-white  dark:text-white"
          >
            {actionText}
          </NextLink>
        ) : null}
        {seeAllLink ? (
          <NextLink
            href={seeAllLink}
            className="text-md flex h-fit items-center gap-2  dark:text-white"
          >
            {seeAllText}
            <span>
              <MdOutlineArrowForward />
            </span>
          </NextLink>
        ) : null}
      </div>
    </Card>
  );
}
