'use client';

import ProcessTable from 'components/admin/data-tables/processTable';
import { useRouter, useSearchParams } from 'next/navigation';
import { log } from 'utils';
import { useEffect, useState } from 'react';
import { deleteProcess, getProcess, updateProcess } from 'app/lib/apiRequest';
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

  const onAdd = (val: any) => {
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
      setIsShowPopUp(true);
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

  //TODO: get Michine data from BE
  const machines = [
    { machineId: '1', machineName: 'Mikrokapsül 1' },
    { machineId: '2', machineName: 'Mikrokapsül 2' },
    { machineId: '3', machineName: 'Mikrokapsül-3' },
    { machineId: '4', machineName: 'Patch-1' },
    { machineId: '5', machineName: 'Patch-2' },
    { machineId: '6', machineName: 'Patch-3' },
    { machineId: '7', machineName: 'Yarı Otomatik -1' },
    { machineId: '8', machineName: 'Manuel' },
    { machineId: '9', machineName: 'Yatay-1' },
    { machineId: '10', machineName: 'Yatay-2' },
    { machineId: '11', machineName: 'Strip' },
    { machineId: '12', machineName: 'Dispenser ' },
    { machineId: '13', machineName: 'Somun' },
    { machineId: '14', machineName: 'Yarı Otomatik-2' },
  ];

  const handleValues = (event) => {
    setValues(JSON.parse(event.target?.value));
  };

  const handleClose = (val: string) => {
    setIsShowPopUp(false);
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
        />
      )}

      <Popup show={isShowPopUp} extra="flex flex-col gap-3 py-6 px-8">
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
                <option value={JSON.stringify(item)} key={idx}>
                  {item.machineName}
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
    </div>
  );
};

export default Process;
