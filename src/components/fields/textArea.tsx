// Custom components
function TextArea(props: {
  id: string;
  label?: string;
  extra?: string;
  placeholder: string;
  variant?: string;
  state?: string;
  disabled?: boolean;
  required?: boolean;
  name: string;
  onChange?: any;
  value?: string;
  rows?: number;
}) {
  const {
    label,
    id,
    extra,
    placeholder,
    variant,
    state,
    disabled,
    onChange,
    name,
    required,
    value,
    rows = 3,
  } = props;

  return (
    <div className={``}>
      {label ? (
        <label
          htmlFor={id}
          className={`mb-1 text-sm text-navy-700 dark:text-white ${
            variant === 'auth' ? 'ml-1.5 font-medium' : 'ml-3 font-bold'
          }`}
        >
          {label}
        </label>
      ) : null}

      {variant === 'data' ? (
        <div className="mb-10 min-h-20 w-full rounded-xl border bg-white/0 p-3 text-sm ">
          {value}
        </div>
      ) : (
        <textarea
          rows={rows}
          value={value}
          onChange={onChange}
          disabled={disabled}
          id={id}
          name={name}
          required={required}
          placeholder={placeholder}
          className={`flex w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none focus:border-[#777777] dark:focus:!border-[#cccccc] ${
            disabled === true
              ? '!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]'
              : state === 'error'
              ? 'border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400'
              : state === 'success'
              ? 'border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400'
              : 'border-gray-200 dark:!border-white/10 dark:text-white'
          } ${extra}`}
        />
      )}
    </div>
  );
}

export default TextArea;
