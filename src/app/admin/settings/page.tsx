'use client';
import General from 'components/admin/profile/General';
import Notification from 'components/admin/profile/Notification';
import Button from 'components/button/button';
import Card from 'components/card';
import { useEffect, useState } from 'react';

import {
  updateMachine,
  getMachines,
  deleteMachine,
  deleteMachineParams,
  addMachineWithParams,
  updateMachineWithParams,
  addMachineParam,
  deleteMachineParam,
} from 'app/lib/apiRequest';
import MachinePopup from 'components/settings/machinePopup';
import MachineList from 'components/settings/machineList';
import { log } from 'utils';

const Setting = () => {
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [machines, setMachines] = useState([]);
  const [machineEdit, setMachineEdit] = useState({} as any);

  const getAllMachines = async () => {
    const { status, data } = await getMachines();
    if (status === 200) {
      setMachines(data);
    }
  };

  useEffect(() => {
    getAllMachines();
  }, []);

  const onAddMachine = async (val) => {
    setIsSubmitting(true);
    const { status } = await addMachineWithParams(val);
    if (status === 200) {
      await getAllMachines();
      setIsShowPopUp(false);
    }
    setIsSubmitting(false);
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

  const showMachineEdit = async (val) => {
    setMachineEdit(val);
    setIsShowPopUp(true);
  };

  const onEditMachine = async (val) => {
    const { machine, params } = val;
    setIsSubmitting(true);
    const { status } = await updateMachine({
      id: machineEdit.id,
      machine_Name: machine.machine_Name,
    });
    if (status === 200) {
      await getAllMachines();
      setIsShowPopUp(false);
      setMachineEdit({});
    }
    setIsSubmitting(false);
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

          <MachineList
            machines={machines}
            handleDeleteMachine={(val) => handleDeleteMachine(val)}
            handleDeleteTechParams={(val) => handleDeleteTechParams(val)}
            handleMachineEdit={(val) => showMachineEdit(val)}
          />
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

      <MachinePopup
        isShowPopUp={isShowPopUp}
        key={machineEdit?.id}
        editData={machineEdit}
        setIsShowPopUp={() => setIsShowPopUp(!isShowPopUp)}
        onAddMachine={(val) => onAddMachine(val)}
        isSubmitting={isSubmitting}
        onEditMachine={(val) => onEditMachine(val)}
      />
    </div>
  );
};

export default Setting;
