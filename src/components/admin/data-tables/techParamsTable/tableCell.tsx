import { useState, useEffect, ChangeEvent } from 'react';
import './table.css';
import { formatDateTime } from 'utils';

type Option = {
  label: string;
  value: string;
};

export const TableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, value);
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    tableMeta?.updateData(row.index, column.id, e.target.value);
  };

  const _value =
    column.id === 'Ort_Uretim_saat' ? formatDateTime(value)?.slice(11) : value;

  if (tableMeta?.editedRows[row.id]) {
    return columnMeta?.type === 'select' ? (
      <select onChange={onSelectChange} value={initialValue}>
        {columnMeta?.options?.map((option: Option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        value={_value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        type={columnMeta?.type || 'text'}
      />
    );
  }

  return (
    <span className="block whitespace-nowrap break-keep py-1">{_value}</span>
  );
};
