import React, { useRef, useState } from 'react';
import EditableBox from 'components/EditableBox';
import Radio from 'components/radio';
import TestTable from './table/testTable';
import { MdCheck } from 'react-icons/md';

export default function Index({ data, onChange, variant }) {
  const [values, setValues] = useState(data || ({} as any));

  const handleChange = (val) => {
    setValues({ ...values, ...val });
    onChange({ ...values, ...val });
  };

  const handleResultValues = (event) => {
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
    onChange({ ...values, ...newVal });
  };

  const handleTestTableChange = (val) => {
    setValues({ ...values, testItem: val });
    onChange({ ...values, testItem: val });
  };

  const resultsList = [
    { value: 'ACCEPT', name: 'Kabul / <br /> Acceptance' },
    {
      value: 'ACCEPTANCE_WITH_CONDITION',
      name: 'Şartlı Kabul / <br /> Conditional <br /> Acceptance',
    },
    { value: 'REJECT', name: 'Red / <br /> Rejection' },
  ];

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
      <TestTable
        onChange={(val) => handleTestTableChange(val)}
        machineName={values?.machineName}
        data={values?.testItem}
        variant={variant}
      />
      <div className="mb-7 w-full text-xs">
        <div className="mb-3 font-semibold">Sonuç / Result:</div>
        <div className="flex flex-wrap justify-around gap-3">
          {resultsList.map((item, idx) => {
            return (
              <div className="flex items-center gap-2" key={idx}>
                <div dangerouslySetInnerHTML={{ __html: item.name }}></div>
                <EditableBox className="w-[70px]">
                  {variant === 'input' ? (
                    <Radio
                      name="result"
                      value={item.value}
                      onChange={handleResultValues}
                      checked={values.result === item.value}
                    />
                  ) : (
                    <div className="flex justify-center">
                      {values.result === item.value ? (
                        <MdCheck className=" h-5 w-5" />
                      ) : (
                        ''
                      )}
                    </div>
                  )}
                </EditableBox>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
