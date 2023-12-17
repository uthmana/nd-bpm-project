import { ReactNode } from 'react';

type Button = {
  extra?: string;
  onClick?: (e: any) => void;
  text: string;
  disabled?: boolean;
  icon?: ReactNode;
};

const Button = ({ extra, onClick, text, disabled, icon }: Button) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`linear flex w-full items-center justify-center rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 ${extra}`}
    >
      {icon} {text}
    </button>
  );
};

export default Button;
