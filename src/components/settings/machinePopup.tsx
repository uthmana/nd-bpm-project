'use client';

import Button from 'components/button/button';
import InputField from 'components/fields/InputField';
import Popup from 'components/popup';
import { useState } from 'react';
import { techParameters } from 'utils';

const MachinePopup = ({
  onAddMachine,
  isSubmitting,
  isShowPopUp,
  setIsShowPopUp,
}) => {
  const [values, setValues] = useState({} as any);
  const [techParamItems, setTechParamItems] = useState(techParameters);
  const [techParamSelected, setTechParamSelected] = useState([]);

  const onAdd = async () => {
    if (!values.machine_Name || techParamSelected.length === 0) return;
    const data = techParamSelected.map((item) => {
      return { machineId: '', param_name: item.param_name };
    });
    onAddMachine({
      machine: values,
      params: data,
    });
  };

  const handleValues = (event) => {
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  const handleRemoveTechParam = (val) => {
    const values = [...techParamItems, val];
    setTechParamItems(values);
    const selectedParams = [...techParamSelected];
    setTechParamSelected(
      selectedParams.filter((item) => {
        return item.id !== val.id;
      }),
    );
  };

  const handleAddTechParam = (val) => {
    const selectedParams = [...techParamSelected, val];
    setTechParamSelected(selectedParams);
    const values = [...techParamItems];
    setTechParamItems(
      values.filter((item) => {
        return item.id !== val.id;
      }),
    );
  };

  const handleClose = () => {
    setIsShowPopUp(false);
  };

  return (
    <Popup
      show={isShowPopUp}
      extra="flex !min-w-[500px] !top-[50%] flex-col gap-3 py-6 px-8"
    >
      <h1 className="text-3xl ">Makine Ayarları</h1>

      <InputField
        label="Makine İsmi"
        onChange={handleValues}
        type="text"
        id="machine_Name"
        name="machine_Name"
        placeholder="Makine İsmi"
        extra="mb-2"
      />

      <div>
        <label className="ml-2">Parametreleri </label>
        <div className="text-bold mt-1 flex min-h-[48px] w-full flex-wrap gap-3 rounded-xl border bg-white/0 p-3 text-sm outline-none">
          {techParamSelected.length > 0 ? (
            <>
              {techParamSelected.map((item, idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => handleRemoveTechParam(item)}
                    className="rounded-md bg-green-600 px-2 py-1 text-sm font-bold text-white"
                  >
                    {item.param_name} X
                  </button>
                );
              })}
            </>
          ) : null}
        </div>
      </div>

      <div className="text-bold mt-1 flex w-full flex-wrap gap-3 rounded-xl bg-white/0 p-3 text-sm">
        {techParamItems.length > 0 ? (
          <>
            {techParamItems.map((item, idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => handleAddTechParam(item)}
                  className="rounded-md bg-gray-600 px-2 py-1 text-sm font-bold text-white"
                >
                  {item.param_name} +
                </button>
              );
            })}
          </>
        ) : null}
      </div>

      <div className="flex gap-4">
        <Button
          text="GERİ"
          extra="w-[60px] h-[40px] bg-red-700"
          onClick={handleClose}
        />
        <Button
          loading={isSubmitting}
          text="KAYDET"
          extra="w-[60px] h-[40px]"
          onClick={onAdd}
        />
      </div>
    </Popup>
  );
};

export default MachinePopup;
