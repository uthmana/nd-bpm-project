'use client';
import General from 'components/admin/profile/General';
import Notification from 'components/admin/profile/Notification';
import Button from 'components/button/button';
import Card from 'components/card';
import InputField from 'components/fields/InputField';
import Popup from 'components/popup';
import { useEffect, useState } from 'react';
import { techParameters } from 'utils';
import {
  addMachineWithParams,
  getMachines,
  deleteMachine,
  deleteMachineParams,
} from 'app/lib/apiRequest';

const Setting = () => {
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState({} as any);
  const [techParamItems, setTechParamItems] = useState(techParameters);
  const [techParamSelected, setTechParamSelected] = useState([]);
  const [machines, setMachines] = useState([]);

  const getAllMachines = async () => {
    const { status, data } = await getMachines();
    if (status === 200) {
      setMachines(data);
    }
  };

  useEffect(() => {
    getAllMachines();
  }, []);

  const onAddMachine = async () => {
    if (!values.machineName && techParamSelected.length === 0) return;
    setIsSubmitting(true);
    const data = techParamSelected.map((item) => {
      return { machineId: '', param_name: item.param_name };
    });
    const { status } = await addMachineWithParams({
      machine: values,
      params: data,
    });
    if (status === 200) {
      await getAllMachines();
      setTechParamSelected([]);
      setTechParamItems(techParameters);
      setIsShowPopUp(false);
    }
    setIsSubmitting(false);
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
  const handleShowPopup = () => {
    setIsShowPopUp(true);
  };

  const handleDeleteMachine = async (id: string) => {
    const { status } = await deleteMachine(id);
    if (status === 200) {
      getAllMachines();
    }
  };

  const handleDeleteTechParams = async (id: string) => {
    const { status } = await deleteMachineParams(id);
    if (status === 200) {
      getAllMachines();
    }
  };

  return (
    <div className="flex w-full flex-col gap-5 lg:gap-5">
      <div className="w-full">
        <Card extra={'w-full h-full p-3'}>
          <div className="mb-4 mt-2 flex w-full justify-between">
            <h2 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
              Makine Ayarları
            </h2>

            <Button
              onClick={handleShowPopup}
              extra="!w-fit px-3 h-[38px]"
              text="Makine Ekle"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 px-2">
            {machines.length > 0 ? (
              <>
                {machines.map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className="relative flex flex-col items-start justify-center rounded-2xl border bg-white bg-clip-border px-3 py-4 shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
                    >
                      <button
                        onClick={() => handleDeleteMachine(item.id)}
                        className="absolute right-2 top-0 text-lg hover:text-red-500"
                      >
                        X
                      </button>
                      <p className="mb-2 text-lg font-bold  text-navy-700 dark:text-white">
                        {item.machine_Name}
                      </p>
                      <div className="mb-2 h-[1px] w-full bg-gray-400" />
                      <div className="w-full">
                        <div className="mb-2 text-sm text-gray-800">
                          Teknikal Parametreleri
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          {item?.machineParams?.length > 0 ? (
                            <>
                              {item.machineParams.map((item, idx) => {
                                return (
                                  <span
                                    key={idx}
                                    className="rounded-md bg-gray-600 px-2 py-1 text-sm font-bold text-white"
                                  >
                                    {item.param_name}{' '}
                                    <button
                                      onClick={() =>
                                        handleDeleteTechParams(item.id)
                                      }
                                      className="text-red-500"
                                    >
                                      X
                                    </button>
                                  </span>
                                );
                              })}
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : null}
          </div>
        </Card>
      </div>

      <div className="mb-4 grid h-full grid-cols-1 gap-5 lg:!grid-cols-12">
        <div className="col-span-5 lg:col-span-12 lg:mb-0 3xl:!col-span-3">
          <Notification />
        </div>
        <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-5">
          <General />
        </div>
      </div>

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
            onClick={onAddMachine}
          />
        </div>
      </Popup>
    </div>
  );
};

export default Setting;
