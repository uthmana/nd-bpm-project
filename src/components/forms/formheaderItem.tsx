import FileViewer from 'components/fileViewer';
import React from 'react';
import { formatDateTime, formatNumberLocale } from 'utils';

export default function FormHeaderItem(props: {
  tilteEn?: string;
  titleTr?: string;
  value?: string | number | any;
  className?: string;
  type?: string;
}) {
  const { tilteEn, titleTr, value, type = 'text', className } = props;

  const formatValue = (val: string) => {
    if (type === 'date') {
      return formatDateTime(val);
    }
    if (type === 'number') {
      return formatNumberLocale(val);
    }
    if (type === 'file') {
      return <FileViewer file={val} />;
    }
    return val;
  };

  return (
    <div className="mb-[2px] flex items-center gap-1 text-xs font-medium">
      <div className="flex w-[110px] flex-col">
        <span>{titleTr} :</span>
        {tilteEn ? (
          <span className="text-[10px] font-normal italic">{tilteEn} :</span>
        ) : null}
      </div>
      <span className={`max-w-[160px] ${className}`}>{formatValue(value)}</span>
    </div>
  );
}
