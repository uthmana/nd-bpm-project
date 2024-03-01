'use client';

import Button from 'components/button/button';
import { Suspense, useEffect, useState } from 'react';

import {
  updateMachine,
  getMachines,
  deleteMachine,
  deleteMachineParams,
  addMachineWithParams,
} from 'app/lib/apiRequest';
import MachinePopup from 'components/settings/machineList/machinePopup';
import MachineItem from './machineItem';
import { log } from 'utils';
import { MdAdd } from 'react-icons/md';
import Loading from 'app/loading';

const MachineList = () => {
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
    <div className="w-full">
      <div className="w-full">
        <div className="mb-8 mt-2 flex w-full justify-between">
          <h2 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
            Makine Yönetimi
          </h2>
          <Button
            onClick={handleShowPopup}
            extra="!w-fit px-3 h-[38px]"
            text="Makine Ekle"
            icon={<MdAdd className="ml-1 h-6 w-6" />}
          />
        </div>
        <Suspense fallback={<Loading />}>
          <MachineItem
            machines={machines}
            handleDeleteMachine={(val) => handleDeleteMachine(val)}
            handleDeleteTechParams={(val) => handleDeleteTechParams(val)}
            handleMachineEdit={(val) => showMachineEdit(val)}
          />
        </Suspense>
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

export default MachineList;
