'use client';

import React, { ReactNode, useState, useRef, useEffect } from 'react';

type Select = {
  name?: string;
  onChange?: (e: any) => void | any;
  children: ReactNode;
  label?: string;
  extra?: string;
  onClick?: (e: any) => void;
  required?: boolean;
  className?: string;
};

const Select = ({
  name,
  onChange,
  children,
  label,
  extra,
  onClick,
  required,
  className,
}: Select) => {
  const [selecedValue, setSelectedValue] = useState('');
  const selectRef = useRef(null);

  const handleOnChange = (e) => {
    setSelectedValue(e.target.value);
    onChange(e);
  };

  useEffect(() => {
    setSelectedValue(selectRef.current?.value);
  }, [selectRef.current?.value]);

  return (
    <div className={`relative w-full ${extra}`} onClick={onClick}>
      <div className="w-full">
        {label ? (
          <label
            htmlFor={name}
            className={`mb-3 ml-2 text-sm font-bold
          text-navy-700 dark:text-white 
        `}
          >
            {label}
            {required !== undefined ? (
              <span
                className={`${
                  required && selecedValue ? 'text-green-600' : 'text-red-400'
                }`}
              >
                *
              </span>
            ) : null}
          </label>
        ) : null}

        <select
          ref={selectRef}
          className={`flex h-[40px] w-full items-center justify-center rounded-xl border bg-white/0 px-1 text-sm outline-none first:!text-[#999]  dark:border-[#283357] dark:text-white dark:focus:!border-[#ffffff] ${className}`}
          name={name}
          onChange={handleOnChange}
        >
          <option selected disabled hidden defaultValue=" "></option>
          {children}
        </select>
      </div>
    </div>
  );
};

export default Select;
