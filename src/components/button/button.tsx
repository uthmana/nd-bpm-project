import { ReactNode } from 'react';

type Button = {
  extra?: string;
  onClick?: (e: any) => void;
  text: string;
  disabled?: boolean;
  icon?: ReactNode;
  loading?: boolean;
};

const Button = ({ extra, onClick, text, disabled, icon, loading }: Button) => {
  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      className={`linear flex h-12 w-full items-center justify-center rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 ${extra}`}
    >
      {loading ? (
        <img src="/img/others/loading.svg" />
      ) : (
        <div className="flex">
          <span> {icon} </span> <span> {text}</span>
        </div>
      )}
    </button>
  );
};

export default Button;
