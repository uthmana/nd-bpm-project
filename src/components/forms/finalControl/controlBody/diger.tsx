import TextArea from 'components/fields/textArea';
import React, { useState } from 'react';

export default function Diger({ data, onChange, variant = 'inputs' }) {
  const [values, setValues] = useState(data || ({} as any));

  const handleValues = (event) => {
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
    onChange({ ...values, ...newVal });
  };

  return (
    <div className="mb-8 flex w-full  flex-col">
      <div className="flex w-full">
        <div className=" flex min-h-11 w-1/4 items-center border border-b-0  border-r-0 border-[#000] p-2 text-sm">
          Test Standard:
        </div>
        <div className="w-3/4 border border-b-0 border-[#000] p-2 text-sm">
          {variant !== 'input' ? (
            <div>{values?.standard}</div>
          ) : (
            <TextArea
              label=""
              onChange={handleValues}
              id="standard"
              name="standard"
              placeholder=""
              extra="rounded-none m-0 border-0 "
              rows={2}
              value={values.standard}
            />
          )}
        </div>
      </div>
      <div className="flex w-full">
        <div className="flex min-h-11 w-1/4 items-center border border-r-0  border-[#000] p-2 text-sm">
          Açıklama / Comments:
        </div>
        <div className="w-3/4 border border-[#000] p-2 text-sm">
          {variant !== 'input' ? (
            <div>{values?.description}</div>
          ) : (
            <TextArea
              label=""
              onChange={handleValues}
              id="description"
              name="description"
              placeholder=""
              extra="rounded-none m-0 border-0 "
              rows={2}
              value={values.description}
            />
          )}
        </div>
      </div>
    </div>
  );
}
