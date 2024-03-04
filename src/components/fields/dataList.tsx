import React from 'react';

export default function DataList(props: {
  placeholder?: string;
  label: string;
  value?: string;
  name?: string;
  id: string;
  listId: string;
  list?: Array<Object | any>;
  required?: boolean;
  onChange?: (e: any) => void;
}) {
  const {
    placeholder,
    value,
    id,
    listId,
    list,
    label,
    name,
    required,
    onChange,
  } = props;
  return (
    <div className="w-full">
      <label
        className="ml-3 text-sm font-bold text-navy-700 dark:text-white"
        htmlFor={id}
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
      <input
        type="text"
        id={id}
        name={name}
        list={listId}
        value={value}
        onChange={onChange}
        className="text-bold mt-1 flex h-10 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none focus:border-[#777777] dark:focus:!border-[#cccccc]"
        placeholder={placeholder}
      />
      <datalist id={listId}>
        {list.map((item) => {
          return (
            <option key={item.id} value={item.company_name}>
              {item.company_name}
            </option>
          );
        })}
      </datalist>
    </div>
  );
}
