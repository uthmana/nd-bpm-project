// Custom components
import EyeIcon from 'components/icons/EyeIcon';
import { useRef, useState } from 'react';

function InputField(props: {
  id: string;
  label?: string;
  extra?: string;
  placeholder: string;
  variant?: string;
  state?: string;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  name: string;
  onChange?: any;
  value?: number | string | any;
  length?: number;
  min?: number;
  format?: string;
}) {
  const {
    label,
    id,
    extra,
    type,
    placeholder,
    variant,
    state,
    disabled,
    onChange,
    name,
    required,
    value,
    length,
    min = 0,
    format = 'tr',
  } = props;

  const inputElem = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const inputCustomType = ['currency', 'quantity'];

  const handlePassword = (e: any) => {
    e.stopPropagation();
    const inputType = inputElem.current?.type;
    inputElem.current.type = inputType === 'password' ? 'text' : 'password';
    setShowPassword(inputType === 'password' ? true : false);
  };

  const currencyMask = (e, format) => {
    let value = e.target.value;
    const locale = {
      tr: () => {
        value = value.replace(/[^0-9,.]/g, '');
        const parts = value.split(',');
        parts[0] = parts[0].replace(/\./g, '');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        if (parts[1]) {
          parts[1] = parts[1].slice(0, 2);
        }
        return parts.length > 1 ? parts.join(',') : parts[0];
      },
      qty: () => {
        value = value.replace(/[^0-9]/g, '');
        value = value.replace(/\./g, '');
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return value;
      },
    };

    if (locale[format]) {
      e.target.value = locale[format]();
    }
    return e;
  };

  const formatTurkishPhone = (e) => {
    let value = e.target.value;
    let cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 10) cleaned = cleaned.substring(0, 10);

    let formatted = '';
    if (cleaned.length > 0) formatted += `(${cleaned.substring(0, 3)}`;
    if (cleaned.length >= 4) formatted += `) ${cleaned.substring(3, 6)}`;
    if (cleaned.length >= 7) formatted += ` ${cleaned.substring(6, 8)}`;
    if (cleaned.length >= 9) formatted += ` ${cleaned.substring(8, 10)}`;
    e.target.value = formatted;

    return e;
  };

  const handleChange = (e, format) => {
    if (type === 'currency' || type === 'quantity') {
      const value = currencyMask(e, format);
      onChange(value);
      return;
    }
    if (type === 'phone') {
      const value = formatTurkishPhone(e);
      onChange(value);
      return;
    }

    onChange(e);
  };

  return (
    <div className={`relative w-full`}>
      {label ? (
        <label
          htmlFor={id}
          className={`text-sm text-navy-700 dark:text-white ${
            variant === 'auth' ? 'ml-1.5 font-medium' : 'ml-3 font-bold'
          }`}
        >
          {label}
          {required !== undefined ? (
            <span
              className={`${
                required && value ? 'text-green-600' : 'text-red-400'
              }`}
            >
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <input
        ref={inputElem}
        value={value}
        onChange={(e) => handleChange(e, format)}
        disabled={disabled}
        type={inputCustomType.includes(type) ? 'text' : type}
        id={id}
        name={name}
        required={required}
        placeholder={placeholder}
        min={min}
        maxLength={length}
        className={`text-bold mt-1 flex h-10 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none focus:border-[#777777] dark:focus:!border-[#cccccc] ${
          disabled === true
            ? '!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]'
            : state === 'error'
            ? 'border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400'
            : state === 'success'
            ? 'border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400'
            : 'border-gray-200 dark:!border-white/10 dark:text-white'
        } ${extra}`}
      />
      {name === 'password' ? (
        <span
          className="absolute bottom-[1px] right-0 cursor-pointer p-3"
          onClick={handlePassword}
        >
          {<EyeIcon open={showPassword} />}
        </span>
      ) : null}
    </div>
  );
}

export default InputField;
