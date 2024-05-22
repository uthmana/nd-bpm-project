import InputField from 'components/fields/InputField';
import React, { useState } from 'react';

export default function ControlFooter({ data, variant = 'input', onChange }) {
  const [value, setValue] = useState(data || { paketleme: '' });

  const handleValue = (event) => {
    const newVal = { [event.target?.name]: event.target?.value };
    setValue({ ...value, ...newVal });
    onChange({ ...value, ...newVal });
  };

  return (
    <div className="flex w-full grid-cols-2 justify-around text-sm font-medium">
      <div>
        <div>
          Testi Gerçekleştiren / <br />
          <span className="text-xs italic">QC Inspector</span>
        </div>
        <div>{data?.createdBy}</div>
      </div>
      <div className="flex flex-col">
        <div>
          Onaylayan / <br />
          <span className="text-xs italic"> QC Supervisor</span>
        </div>

        {variant !== 'input' ? (
          <div>{data?.paketleme}</div>
        ) : (
          <div>
            <InputField
              label=""
              onChange={handleValue}
              type="text"
              id="paketleme"
              name="paketleme"
              placeholder=""
              extra="!rounded-none  h-[32px] !p-1 border-1 !border-[#000]"
              value={value?.paketleme}
              disabled={variant !== 'input'}
            />
          </div>
        )}
      </div>
    </div>
  );
}
