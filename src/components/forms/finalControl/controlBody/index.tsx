import React, { useState } from 'react';
import Box from 'components/Box';
import Radio from 'components/radio';
import TestTable from './table/testTable';
import { MdCheck } from 'react-icons/md';
import TestArea from './table/testArea';
import InputField from 'components/fields/InputField';
import { formatNumberLocale } from 'utils';

export default function Index({ data, onChange, variant, standard }) {
  const [values, setValues] = useState(data || ({} as any));

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

  const handleQuantityValues = (event) => {
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
    onChange({ ...values, ...newVal });
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
        variant={variant}
      />
      <TestTable
        onChange={(val) => handleTestTableChange(val)}
        machineName={values?.machineName}
        data={values?.testItem}
        standard={standard}
        variant={variant}
      />

      <div className="mb-5 w-full ">
        {variant === 'input' ? (
          <div className="flex w-full items-center justify-between gap-3">
            <InputField
              label="Kontrol Miktar"
              onChange={handleQuantityValues}
              type="number"
              id="kontrol_edilen_miktar"
              name="kontrol_edilen_miktar"
              placeholder=""
              extra="mb-2 !rounded-none h-[32px] !p-1 border-1 !border-[#000]"
              value={values?.kontrol_edilen_miktar}
              required={true}
              disabled={variant !== 'input'}
            />
            <InputField
              label="Nakliye Miktar"
              onChange={handleQuantityValues}
              type="number"
              id="nakliye_miktar"
              name="nakliye_miktar"
              placeholder=""
              extra="mb-2 !rounded-none  h-[32px] !p-1 border-1 !border-[#000]"
              value={values?.nakliye_miktar}
              required={true}
              disabled={variant !== 'input'}
            />
            <InputField
              label="Hatalı Miktar"
              onChange={handleQuantityValues}
              type="number"
              id="hatali_miktar"
              name="hatali_miktar"
              placeholder=""
              extra="mb-2 !rounded-none  h-[32px] !p-1 border-1 !border-[#000]"
              value={values?.hatali_miktar}
              disabled={variant !== 'input'}
            />
          </div>
        ) : (
          <div className="flex w-full gap-2 text-sm">
            <div className="mb-2 grow basis-0 items-center">
              <div> Kontrol Miktar</div>
              <div className="flex h-[32px] items-center bg-gray-100 p-1">
                {formatNumberLocale(values?.kontrol_edilen_miktar)}
              </div>
            </div>
            <div className="mb-2 grow basis-0">
              <div> Nakliye Miktar</div>
              <div className="flex h-[32px] items-center bg-gray-100 p-1">
                {formatNumberLocale(values?.nakliye_miktar)}
              </div>
            </div>
            <div className="mb-2 grow basis-0">
              <div>Hatalı Miktar</div>
              <div className="flex h-[32px] items-center bg-gray-100 p-1">
                {formatNumberLocale(values?.hatali_miktar)}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-7 w-full text-xs">
        <div className="mb-3 font-semibold">Sonuç / Result:</div>
        <div className="flex flex-wrap justify-around gap-3">
          {resultsList.map((item, idx) => {
            return (
              <div className="flex items-center gap-2" key={idx}>
                <div dangerouslySetInnerHTML={{ __html: item.name }}></div>
                <Box className="w-[70px]">
                  {variant === 'input' ? (
                    <Radio
                      name="result"
                      value={item.value}
                      onChange={handleResultValues}
                      checked={values?.result === item.value}
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
                </Box>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
