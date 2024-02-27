'use client';

import Button from 'components/button/button';
import { useState } from 'react';
import {
  MdAdd,
  MdArrowDropDown,
  MdOutlineArrowDownward,
  MdOutlineKeyboardArrowDown,
} from 'react-icons/md';

const ApplicationList = () => {
  return (
    <div className="full">
      <div className="mb-4 mt-2 flex w-full justify-between">
        <h2 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          Uygulama Yönetimi
        </h2>
        <Button
          onClick={() => console.log('test')}
          extra="!w-fit px-3 h-[38px]"
          text=""
          icon={<MdAdd className="ml-1 h-6 w-6" />}
        />
      </div>
    </div>
  );
};

export default ApplicationList;
