import React, { useRef, useState } from 'react';
import EditableBox from 'components/Box';
import Radio from 'components/radio';
import TestTable from './table/testTable';
import { MdCheck } from 'react-icons/md';
import TestArea from './table/testArea';

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

  const handleTestAreaChange = (val) => {
    setValues({ ...values, testArea: val });
    onChange({ ...values, testArea: val });
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
      <TestArea
        onChange={(val) => handleTestAreaChange(val)}
        data={values?.testArea}
        variant={'variant'}
      />
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
