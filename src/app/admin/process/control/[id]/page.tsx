'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getProcessById,
  addProcessControl,
  updateProcessControl,
} from 'app/lib/apiRequest';
import { useParams, useRouter } from 'next/navigation';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import ProcessControlForm from 'components/forms/processControl';
import { useSession } from 'next-auth/react';
import Card from 'components/card';
import { log } from 'util';

export default function EntryControl() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryParams = useParams();
  const [isLoading, setIsloading] = useState(false);
  const [process, setProcess] = useState({} as any);
  const [processControl, setProcessControl] = useState({} as any);
  const { data: session } = useSession();

  useEffect(() => {
    const getSingleProcess = async () => {
      setIsloading(true);
      const { status, data } = await getProcessById(queryParams.id);
      if (status === 200) {
        setProcess(data);
        setProcessControl(data?.finalControl[0]);
        setIsloading(false);
        return;
      }
      setIsloading(true);
      //TODO: handle error
    };
    if (queryParams.id) {
      getSingleProcess();
    }
  }, [queryParams?.id]);

  const handleSubmit = async (val) => {
    const [values, isUpdate] = val;
    setIsSubmitting(true);
    if (isUpdate) {
      const resData: any = await updateProcessControl({
        ...values,
        processId: process.id,
        faultId: process.faultId,
        updatedBy: session?.user?.name,
      });

      const { status, response } = resData;
      if (response?.error) {
        const { message, detail } = response?.error;
        toast.error('Proses final kontrol başarısız.' + message);
        log(detail);
        setIsSubmitting(false);
        return;
      }

      if (status === 200) {
        toast.success('Proses final kontrol güncelleme işlemi başarılı.');
        router.push('/admin/process');
        setIsSubmitting(false);
        return;
      }
    }

    // add new final control
    const resProcess: any = await addProcessControl({
      ...values,
      processId: process.id,
      faultId: process.faultId,
      createdBy: session?.user?.name,
    });

    const { status, response } = resProcess;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Proses final kontrol ekleme işlemi başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      toast.success('Ürün final kontrol işlemi başarılı.');
      router.push('/admin/process');
      setIsSubmitting(false);
      return;
    }
  };

  return (
    <Card className="mx-auto mt-4 max-w-[700px] rounded-2xl bg-white px-8 py-10 dark:bg-[#111c44] dark:text-white">
      {isLoading ? (
        <LatestInvoicesSkeleton />
      ) : (
        <ProcessControlForm
          title={'Ürün Final Kontrol Formu'}
          info={process}
          data={processControl}
          isSubmitting={isSubmitting}
          onSubmit={(...val) => handleSubmit(val)}
        />
      )}
    </Card>
  );
}
