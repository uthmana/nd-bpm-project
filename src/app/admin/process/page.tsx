'use client';

import ProcessTable from 'components/admin/data-tables/processTable';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { deleteProcess, getEntryWithFilters } from 'app/lib/apiRequest';
import { TableSkeleton } from 'components/skeleton';
import { toast } from 'react-toastify';
import Popup from 'components/popup';
import Button from 'components/button';
import { useSession } from 'next-auth/react';
import { getResError } from 'utils/responseError';

const Process = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const searchVal = searchParams.get('q');
  const [searchText, setSearchText] = useState(searchVal || '');
  const [process, setProcess] = useState([]);
  const [processId, setProcessId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowProcessPopUp, setIsShowProcessPopUp] = useState(false);

  const getAllProcess = async () => {
    try {
      setIsLoading(true);
      const { data } = await getEntryWithFilters({
        where: {
          status: {
            in: [
              'PROSES_BEKLENIYOR',
              'PROSES_ISLENIYOR',
              'FINAL_KONTROL_BEKLENIYOR',
              'FINAL_KONTROL_RET',
            ],
          },
        },
        include: {
          process: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
      const formatedData = data.map((item) => {
        if (item.process[0]) {
          return {
            ...item,
            processId: item.process?.[0]?.id,
            machineName: item.process?.[0]?.machineName,
          };
        }
        return item;
      });
      setProcess(formatedData);
      setIsLoading(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllProcess();
  }, []);

  useEffect(() => {
    setSearchText(searchVal || '');
  }, [searchVal]);

  const onComfirm = async (faultId) => {
    const _processId = process?.find((item) => item.id === faultId)?.processId;
    if (!_processId) return;
    setProcessId(_processId);
    setIsShowProcessPopUp(true);
  };

  const onControl = async (faultId) => {
    const _processId = process?.find((item) => item.id === faultId)?.processId;
    if (!_processId) {
      router.push(`/admin/process/create/${faultId}?newprocess=true`);
      return;
    }
    router.push(`/admin/process/create/${_processId}`);
  };

  const onDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteProcess(processId);
      await getAllProcess();
      setIsSubmitting(false);
      setIsShowProcessPopUp(false);
      toast.success('Proses silme işlemi başarılı.');
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsSubmitting(false);
    }
  };

  const handleProcessClose = (val: string) => {
    setIsShowProcessPopUp(false);
  };

  return (
    <div className="mt-3 w-full">
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <ProcessTable
          tableData={process as any}
          variant={session?.user?.role}
          searchValue={searchText}
          key={searchVal}
          onDelete={onComfirm}
          onControl={(val) => onControl(val)}
        />
      )}

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
