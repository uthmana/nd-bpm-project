'use client';
import React, { forwardRef } from 'react';

const Card = forwardRef<
  HTMLDivElement,
  {
    variant?: string;
    extra?: string;
    children?: JSX.Element | any[];
    [x: string]: any;
  }
>((props, ref) => {
  const { variant, extra, children, ...rest } = props;

  return (
    <div
      ref={ref} // ✅ Now properly typed
      className={`!z-5 relative flex flex-col rounded-xl bg-white bg-clip-border shadow-3xl ${
        props.default
          ? 'shadow-shadow-500 dark:shadow-none'
          : 'shadow-shadow-100 dark:shadow-none'
      }  dark:!bg-navy-800 dark:text-white  ${extra}`}
      {...rest}
    >
      {children}
    </div>
  );
});

export default Card;
