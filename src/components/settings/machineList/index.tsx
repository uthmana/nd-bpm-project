'use client';

import Button from 'components/button';
import { useState } from 'react';

import {
  updateMachine,
  getMachines,
  deleteMachine,
  deleteMachineParams,
  addMachineWithParams,
} from 'app/lib/apiRequest';
import MachinePopup from 'components/settings/machineList/machinePopup';
import MachineItem from './machineItem';
import { MdAdd } from 'react-icons/md';
import { getResError } from 'utils/responseError';
import { toast } from 'react-toastify';

const MachineList = ({ data }) => {
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [machines, setMachines] = useState(data || []);
  const [machineEdit, setMachineEdit] = useState({} as any);

  const getAllMachines = async () => {
    try {
      const { data } = await getMachines();
      setMachines(data);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
    }
  };

  const onAddMachine = async (val) => {
    try {
      setIsSubmitting(true);
      await addMachineWithParams(val);
      await getAllMachines();
      setIsShowPopUp(false);
      setIsSubmitting(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsSubmitting(false);
    }
  };

  const handleDeleteMachine = async (id: string) => {
    try {
      await deleteMachine(id);
      await getAllMachines();
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
    }
  };

  const handleDeleteTechParams = async (id: string) => {
    try {
      await deleteMachineParams(id);
      await getAllMachines();
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
    }
  };

  const onEditMachine = async (val) => {
    try {
      setIsSubmitting(true);
      const { machine } = val;

      await updateMachine({
        id: machineEdit.id,
        machine_Name: machine.machine_Name,
      });

      await getAllMachines();
      setMachineEdit({});
      setIsShowPopUp(false);
      setIsSubmitting(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsShowPopUp(false);
      setIsSubmitting(false);
    }
  };

  const handleShowPopup = () => {
    setIsShowPopUp(true);
  };

  const showMachineEdit = async (val) => {
    setMachineEdit(val);
    setIsShowPopUp(true);
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

        <MachineItem
          machines={machines}
          handleDeleteMachine={(val) => handleDeleteMachine(val)}
          handleDeleteTechParams={(val) => handleDeleteTechParams(val)}
          handleMachineEdit={(val) => showMachineEdit(val)}
        />
      </div>
      <MachinePopup
        isShowPopUp={isShowPopUp}
        key={isShowPopUp as any}
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
