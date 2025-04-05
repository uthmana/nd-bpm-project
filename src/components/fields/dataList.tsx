import React, { useRef, useState } from 'react';
import { turkeyCities } from 'utils';

export default function DataList(props: {
  placeholder?: string;
  label: string;
  value?: string;
  name?: string;
  id: string;
  listId: string;
  list?: Array<{ id: string; company_name: string }>;
  required?: boolean;
  disabled?: boolean;
  onChange?: (e: any) => void;
  loadOptions?: () => void;
}) {
  const {
    placeholder = '',
    value = '',
    id,
    listId,
    list = [],
    label,
    name,
    required,
    disabled,
    onChange,
    loadOptions,
  } = props;

  const initPlaceHolder = placeholder;
  const inputRef = useRef<HTMLInputElement>(null);
  const [placeholderValue, setPlaceholderValue] = useState(placeholder);
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState(list);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleFocus = async () => {
    if (loadOptions && options.length === 0) {
      try {
        setLoading(true);
        const { data }: any = await loadOptions();
        setOptions(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    setPlaceholderValue(inputValue || placeholder);
    setInputValue('');
  };

  const handleBlur = () => {
    if (!inputValue && placeholderValue != initPlaceHolder) {
      setInputValue(placeholderValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    const selectedData = options?.find(
      (item) => item.company_name === e.target.value,
    );
    if (!selectedData) {
      setSelectedItem(null);
      return;
    }
    setSelectedItem(selectedData);
    onChange?.({
      target: e.target,
      value: e.target.value,
      selectedData,
    });
  };

  return (
    <div className="relative w-full">
      <label
        className="ml-3 text-sm font-bold text-navy-700 dark:text-white"
        htmlFor={id}
      >
        {label}
        {required !== undefined ? (
          <span className={`${required ? 'text-green-600' : 'text-red-400'}`}>
            *
          </span>
        ) : null}
      </label>
      <input
        type="text"
        id={id}
        name={name}
        list={listId}
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholderValue}
        disabled={disabled !== undefined ? disabled : loading}
        className={`text-bold mt-1  flex h-10 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none focus:border-[#777777] dark:focus:!border-[#cccccc] ${
          disabled ? '!bg-gray-50' : ''
        }`}
        title={inputValue}
      />
      {loading ? (
        <span className="pointer-events-none absolute top-7 flex h-10 w-full justify-end  text-right">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/img/others/loading-dark.svg`}
            className="h-12 w-12"
          />
        </span>
      ) : null}
      <datalist id={listId}>
        {options.map((item: any) => (
          <option key={item.id} value={item.company_name}>
            {turkeyCities[item?.province_code]}
            {item?.district_code ? ` | ${item?.district_code}` : ''}
          </option>
        ))}
      </datalist>
    </div>
  );
}
