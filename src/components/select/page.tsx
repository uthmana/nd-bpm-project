'use client';

import React from 'react';

const Select = ({ name, onChange, children, label, extra }) => {
  return (
    <div className={`relative w-full ${extra}`}>
      <div className="w-full">
        <label
          htmlFor={name}
          className={`mb-3 ml-2 text-sm font-bold
          text-navy-700 dark:text-white 
        `}
        >
          {label}
        </label>
        <select
          className={`flex h-[40px] w-full items-center justify-center rounded-xl border bg-white/0  text-sm outline-none dark:text-white`}
          name={name}
          onChange={onChange}
        >
          <option disabled value="">
            {label}
          </option>
          {children}
        </select>
      </div>
    </div>
  );
};

export default Select;
