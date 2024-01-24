'use client';

import ProcessTable from 'components/admin/data-tables/processTable';
import { useRouter, useSearchParams } from 'next/navigation';
import { log } from 'utils';
import { useEffect, useState } from 'react';
import {
  deleteProcess,
  getProcess,
  updateProcess,
  getMachines,
} from 'app/lib/apiRequest';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import { toast } from 'react-toastify';
import Popup from 'components/popup';
import Button from 'components/button/button';
import { useSession } from 'next-auth/react';
import Select from 'components/select/page';

const Process = () => {
  const router = useRouter();
  const [process, setProcess] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [processId, setProcessId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const searchVal = searchParams.get('q');
  const [searchText, setSearchText] = useState(searchVal || '');
  const [processInfo, setProcessInfo] = useState('');
  const [currentProcess, setCurrentProcess] = useState({});
  const [values, setValues] = useState({} as any);
  const [machines, setMachines] = useState([]);
  const [isShowProcessPopUp, setIsShowProcessPopUp] = useState(false);

  const getAllProcess = async () => {
    setIsLoading(true);
    const { status, data } = await getProcess();
    if (status === 200) {
      setProcess(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllProcess();
  }, []);

  useEffect(() => {
    setSearchText(searchVal || '');
  }, [searchVal]);

  const onAdd = async (val: any) => {
    if (!val) return;
    delete val.technicalParams;
    const {
      id,
      product,
      application,
      standard,
      color,
      machineId,
      customerName,
    } = val;
    setProcessId(id);
    setCurrentProcess(val);
    if (!machineId) {
      setProcessInfo(`${customerName}, ${product}, 
      ${application}, ${standard}, ${color}`);
      const { status, data } = await getMachines();
      if (status === 200) {
        setMachines(data);
        setIsShowPopUp(true);
        return;
      }
      return;
    }
    router.push(`/admin/process/${id}`);
  };
  const onAddMachine = async () => {
    if (!values?.machineId) return;
    setIsSubmitting(true);
    const { status, data } = await updateProcess({
      ...currentProcess,
      ...values,
    });
    if (status === 200) {
      toast.success('Makine ekleme işlemi başarılı.');
      router.push(`/admin/process/${processId}`);
      //setIsShowPopUp(false);
      return;
    }
    toast.error('Bir hata oluştu, tekrar deneyin !');
    return;
  };

  const handleValues = (event) => {
    setValues(JSON.parse(event.target?.value));
  };

  const handleClose = (val: string) => {
    setIsShowPopUp(false);
  };

  const onComfirm = async (val) => {
    setProcessId(val);
    setIsShowProcessPopUp(true);
  };

  const onDelete = async () => {
    setIsSubmitting(true);
    const { status } = await deleteProcess(processId);
    if (status === 200) {
      toast.success('Proses silme işlemi başarılı.');
      await getAllProcess();
      setIsSubmitting(false);
      setIsShowProcessPopUp(false);
      return;
    } else {
      toast.error('Bir hata oluştu, tekrar deneyin !');
    }
  };

  const onEdit = (val) => {
    // router.push(`/admin/entry/${val}`);
  };

  const handleProcessClose = (val: string) => {
    setIsShowProcessPopUp(false);
  };

  return (
    <div className="mt-3 w-full">
      {isLoading ? (
        <LatestInvoicesSkeleton />
      ) : (
        <ProcessTable
          onAdd={(val) => onAdd(val)}
          tableData={process as any}
          variant={session?.user?.role}
          searchValue={searchText}
          key={searchVal}
          onEdit={(val) => onEdit(val)}
          onDelete={onComfirm}
        />
      )}

      <Popup key={1} show={isShowPopUp} extra="flex flex-col gap-3 py-6 px-8">
        <h1 className="text-3xl">Makine Şeçimi</h1>
        <p className="mb-2 text-lg">{processInfo}</p>

        <div className="mb-2 flex flex-col gap-3 sm:flex-row">
          <Select
            extra="pt-1"
            label="Makine Seçimi"
            onChange={handleValues}
            name="machineName"
          >
            <option value="{}" selected>
              Makine Seç
            </option>
            {machines.map((item, idx) => {
              return (
                <option
                  value={JSON.stringify({
                    machineId: item.id,
                    machineName: item.machine_Name,
                  })}
                  key={idx}
                >
                  {item.machine_Name}
                </option>
              );
            })}
          </Select>
        </div>

        <div className="flex gap-4">
          <Button
            text="GERİ"
            extra="w-[60px] bg-red-700 h-[40px]"
            onClick={handleClose}
          />
          <Button
            loading={isSubmitting}
            text="DEVAM"
            extra="w-[60px] h-[40px]"
            onClick={onAddMachine}
          />
        </div>
      </Popup>

      <Popup
        key={2}
        show={isShowProcessPopUp}
        extra="flex flex-col gap-3 py-6 px-8"
      >
        <h1 className="text-3xl">Proces Silme</h1>
        <p className="mb-2 text-lg">Bu Proses Silmek istediğini Emin misin ?</p>
        <div className="flex gap-4">
          <Button
            loading={isSubmitting}
            text="SİL"
            extra="w-[60px] bg-red-700 h-[40px]"
            onClick={onDelete}
          />
          <Button
            text="GERİ"
            extra="w-[60px] h-[40px]"
            onClick={handleProcessClose}
          />
        </div>
      </Popup>
    </div>
  );
};

export default Process;
