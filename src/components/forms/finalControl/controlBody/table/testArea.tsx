import Box from 'components/Box';
import React, { useState } from 'react';
import { testAreaData } from './defaultData';
import InputField from 'components/fields/InputField';
import Select from 'components/select/page';

export default function TestArea(props: {
  onChange?: (v) => void;
  data?: any;
  variant?: string;
}) {
  const { onChange, data, variant = 'input' } = props;
  const [values, setValues] = useState(data || testAreaData);
  const dataUnit = ['mm', 'diş'];

  const handleValues = (event, index) => {
    const newList = values.map((item, idx) => {
      if (idx === index) {
        const newVal = { [event.target?.name]: event.target?.value };
        return { ...item, ...newVal };
      }
      return item;
    });
    setValues(newList);
    onChange(newList);
  };

  return (
    <div>
      {values.map((item, idx) => {
        return (
          <div key={idx} className="mb-5 flex flex-col">
            <div className="mb-3 text-center text-xs"> {item.title} </div>
            <div className="flex flex-wrap  justify-between gap-1">
              <div className="">
                <div className="mb-1 text-xs">İstenen/ Requested</div>
                <div className="flex flex-nowrap items-center gap-1 text-xs">
                  {variant !== 'input' ? (
                    <>
                      <Box text={item.requiredValue} />
                      <Box text={item.unit || 'mm/diş'} className="border-0" />
                      <Box text={item.required_1} />
                      <Box text={item.required_2} />
                      <Box text={item.required_3} />
                      <Box text={item.required_4} />
                    </>
                  ) : (
                    <>
                      <InputField
                        key={'requiredValue' + idx}
                        label=""
                        onChange={(e) => handleValues(e, idx)}
                        type="text"
                        id="requiredValue"
                        name="requiredValue"
                        placeholder=""
                        extra="mb-2 !rounded-none !w-[60px] h-[32px] !p-1 border-1 !border-[#000]"
                        value={item.requiredValue}
                      />

                      <Select
                        className="!border-1 !mb-1 !h-[32px] !w-[48px] !rounded-none !border-[#000] !p-0"
                        label=""
                        name="unit"
                        onChange={(e) => handleValues(e, idx)}
                        key={'unit' + idx}
                      >
                        {dataUnit?.map((val, dx) => {
                          return (
                            <>
                              <option
                                value={val}
                                key={dx}
                                selected={val === item.unit}
                              >
                                {val}
                              </option>
                            </>
                          );
                        })}
                      </Select>

                      <InputField
                        label=""
                        key={'required_1' + idx}
                        onChange={(e) => handleValues(e, idx)}
                        type="text"
                        id="required_1"
                        name="required_1"
                        placeholder=""
                        extra="mb-2 !rounded-none !w-[60px] h-[32px] !p-1 border-1 !border-[#000]"
                        value={item.required_1}
                      />
                      <InputField
                        label=""
                        key={'required_2' + idx}
                        onChange={(e) => handleValues(e, idx)}
                        type="text"
                        id="required_2"
                        name="required_2"
                        placeholder=""
                        extra="mb-2 !rounded-none !w-[60px] h-[32px] !p-1 border-1 !border-[#000]"
                        value={item.required_2}
                      />
                      <InputField
                        label=""
                        key={'required_3' + idx}
                        onChange={(e) => handleValues(e, idx)}
                        type="text"
                        id="required_3"
                        name="required_3"
                        placeholder=""
                        extra="mb-2 !rounded-none !w-[60px] h-[32px] !p-1 border-1 !border-[#000]"
                        value={item.required_3}
                      />
                      <InputField
                        label=""
                        key={'required_4' + idx}
                        onChange={(e) => handleValues(e, idx)}
                        type="text"
                        id="required_4"
                        name="required_4"
                        placeholder=""
                        extra="mb-2 !rounded-none !w-[60px] h-[32px] !p-1 border-1 !border-[#000]"
                        value={item.required_4}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="">
                <div className="mb-1 text-xs">Sonuçlar / Results</div>
                <div className="flex flex-nowrap items-center gap-1 text-xs">
                  {variant !== 'input' ? (
                    <>
                      <Box text={item.result_1} />
                      <Box text={item.result_2} />
                      <Box text={item.result_3} />
                      <Box text={item.result_4} />
                      <Box text={item.result_5} />
                      <Box text={item.result_6} />
                    </>
                  ) : (
                    <>
                      <InputField
                        label=""
                        onChange={(e) => handleValues(e, idx)}
                        type="text"
                        id="result_1"
                        name="result_1"
                        placeholder=""
                        extra="mb-2 !rounded-none !w-[60px] h-[32px] !p-1 border-1 !border-[#000]"
                        value={item.result_1}
                      />
                      <InputField
                        label=""
                        onChange={(e) => handleValues(e, idx)}
                        type="text"
                        id="result_2"
                        name="result_2"
                        placeholder=""
                        extra="mb-2 !rounded-none !w-[60px] h-[32px] !p-1 border-1 !border-[#000]"
                        value={item.result_2}
                      />
                      <InputField
                        label=""
                        onChange={(e) => handleValues(e, idx)}
                        type="text"
                        id="result_3"
                        name="result_3"
                        placeholder=""
                        extra="mb-2 !rounded-none !w-[60px] h-[32px] !p-1 border-1 !border-[#000]"
                        value={item.result_3}
                      />
                      <InputField
                        label=""
                        onChange={(e) => handleValues(e, idx)}
                        type="text"
                        id="result_4"
                        name="result_4"
                        placeholder=""
                        extra="mb-2 !rounded-none !w-[60px] h-[32px] !p-1 border-1 !border-[#000]"
                        value={item.result_4}
                      />
                      <InputField
                        label=""
                        onChange={(e) => handleValues(e, idx)}
                        type="text"
                        id="result_5"
                        name="result_5"
                        placeholder=""
                        extra="mb-2 !rounded-none !w-[60px] h-[32px] !p-1 border-1 !border-[#000]"
                        value={item.required_5}
                      />
                      <InputField
                        label=""
                        onChange={(e) => handleValues(e, idx)}
                        type="text"
                        id="result_6"
                        name="result_6"
                        placeholder=""
                        extra="mb-2 !rounded-none !w-[60px] h-[32px] !p-1 border-1 !border-[#000]"
                        value={item.required_6}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
