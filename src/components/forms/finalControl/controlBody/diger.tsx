import TextArea from 'components/fields/textArea';
import React, { useState } from 'react';

export default function Diger({ data, onChange, variant = 'input', standard }) {
  const [tableData, setTableData] = useState(data);

  const handleValues = (event, index) => {
    const newList = tableData?.map((item, idx) => {
      if (idx === index) {
        const newVal = { [event.target?.name]: event.target?.value };
        return { ...item, ...newVal };
      }
      return item;
    });
    setTableData(newList);
    onChange(newList);
  };

  return (
    <div className="mb-8 flex w-full  flex-col">
      <div className="flex w-full">
        <div className=" flex min-h-11 w-1/4 items-center border border-b-0  border-r-0 border-[#000] p-2 text-sm">
          {tableData[0].standard}
        </div>
        <div className="w-3/4 border border-b-0 border-[#000] p-2 text-sm">
          {variant !== 'input' ? (
            <div>{tableData[0].description || standard}</div>
          ) : (
            <TextArea
              label=""
              onChange={(e) => handleValues(e, 0)}
              id="description"
              name="description"
              placeholder=""
              extra="rounded-none m-0 border-0 "
              rows={2}
              value={tableData[0].description || standard}
            />
          )}
        </div>
      </div>
      <div className="flex w-full">
        <div className="flex min-h-11 w-1/4 items-center border border-r-0  border-[#000] p-2 text-sm">
          {tableData[1].standard}
        </div>
        <div className="w-3/4 border border-[#000] p-2 text-sm">
          {variant !== 'input' ? (
            <div>{tableData[1].description}</div>
          ) : (
            <TextArea
              label=""
              onChange={(e) => handleValues(e, 1)}
              id="description"
              name="description"
              placeholder=""
              extra="rounded-none m-0 border-0 "
              rows={2}
              value={tableData[1].description}
            />
          )}
        </div>
      </div>
    </div>
  );
}
