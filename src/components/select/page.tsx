'use client';

import React, { ReactNode } from 'react';

type Select = {
  name?: string;
  onChange?: (e: any) => void;
  children: ReactNode;
  label: string;
  extra?: string;
  onClick?: (e: any) => void;
  required?: boolean;
};

const Select = ({
  name,
  onChange,
  children,
  label,
  extra,
  onClick,
  required,
}: Select) => {
  return (
    <div className={`relative w-full ${extra}`} onClick={onClick}>
      <div className="w-full">
        <label
          htmlFor={name}
          className={`mb-3 ml-2 text-sm font-bold
          text-navy-700 dark:text-white 
        `}
        >
          {label}
          {required ? <span className="!text-red-400">*</span> : null}
        </label>
        <select
          className={`flex h-[40px] w-full items-center justify-center rounded-xl border bg-white/0 px-1  text-sm outline-none dark:text-white`}
          name={name}
          onChange={onChange}
        >
          <option selected disabled defaultValue="">
            {label}
          </option>
          {children}
        </select>
      </div>
    </div>
  );
};

export default Select;
