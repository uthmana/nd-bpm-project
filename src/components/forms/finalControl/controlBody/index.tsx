import React, { useRef, useState } from 'react';
import EditableBox from 'components/EditableBox';
import Radio from 'components/radio';
import TestTable from './table/testTable';

export default function Index({ data }) {
  const [values, setValues] = useState(data || ({} as any));

  const handleValues = (event) => {
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  const handleChange = (val) => {
    setValues({ ...values, ...val });
  };

  return (
    <div className="w-full">
      <h2 className="mb-3 text-center text-sm font-medium">
        Final Kontrol Parametreleri / Final Control Parameters
      </h2>
      <div className="w-full">
        <div className="mb-3 text-xs">
          <span> Görünüm / Appearance</span>
          <span> Uygun / Uygun Değil</span>
        </div>
      </div>

      <div className="mb-5 flex flex-col">
        <div className="mb-3 text-center text-xs">Ön Alan / Lead Area</div>
        <div className="flex flex-wrap justify-between gap-1">
          <div className="">
            <div className="mb-1 text-xs">İstenen/ Requested</div>
            <div className="flex flex-nowrap items-center gap-1 text-xs">
              <EditableBox editable={true} label="mm/diş" />
              <EditableBox className="w-[70px]" />
              <EditableBox className="w-[70px]" />
              <EditableBox />
              <EditableBox />
            </div>
          </div>
          <div className="">
            <div className="mb-1 text-xs">Sonuçlar / Results</div>
            <div className="flex flex-nowrap items-center gap-1 text-xs">
              <EditableBox editable={true} className="w-[70px]" />
              <EditableBox className="w-[70px]" />
              <EditableBox />
              <EditableBox />
              <EditableBox />
              <EditableBox />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-col">
        <div className="mb-3 text-center text-xs">
          Uygulama Alanı / Coverage Area:
        </div>
        <div className="flex flex-wrap justify-between gap-1">
          <div className="">
            <div className="mb-1 text-xs">İstenen/ Requested</div>
            <div className="flex flex-nowrap items-center gap-1 text-xs">
              <EditableBox editable={true} label="mm/diş" />
              <EditableBox className="w-[70px]" />
              <EditableBox className="w-[70px]" />
              <EditableBox />
              <EditableBox />
            </div>
          </div>
          <div className="">
            <div className="mb-1 text-xs">Sonuçlar / Results</div>
            <div className="flex flex-nowrap items-center gap-1 text-xs">
              <EditableBox editable={true} className="w-[70px]" />
              <EditableBox className="w-[70px]" />
              <EditableBox />
              <EditableBox />
              <EditableBox />
              <EditableBox />
            </div>
          </div>
        </div>
      </div>
      <TestTable onChange={(val) => handleChange(val)} data={values} />
      <div className="mb-7 w-full text-xs">
        <div className="mb-3 font-semibold">Sonuç / Result:</div>
        <div className="flex flex-wrap justify-around gap-3">
          <div className="flex items-center gap-2">
            <div className="">
              Kabul / <br /> Acceptance
            </div>
            <EditableBox className="w-[70px]">
              <Radio
                name="result"
                value={'ACCEPT'}
                onChange={handleValues}
                checked={values.result === 'ACCEPT'}
              />
            </EditableBox>
          </div>

          <div className="flex items-center gap-2">
            <div className="">
              Şartlı Kabul / <br /> Conditional <br /> Acceptance
            </div>
            <EditableBox className="w-[70px]">
              <Radio
                name="result"
                value={'ACCEPT_WITH_CONDITION'}
                onChange={handleValues}
                checked={values.result === 'ACCEPT_WITH_CONDITION'}
              />
            </EditableBox>
          </div>

          <div className="flex items-center gap-2">
            <div className="">
              Red / <br /> Rejection
            </div>
            <EditableBox className="flex w-[70px]">
              <Radio
                name="result"
                value={'REJECT'}
                onChange={handleValues}
                checked={values.result === 'REJECT'}
              />
            </EditableBox>
          </div>
        </div>
      </div>
    </div>
  );
}
