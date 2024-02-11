'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getFaultById,
  addControl,
  getEntryControlByfaultId,
  updateFaultControl,
} from 'app/lib/apiRequest';
import { useParams, useRouter } from 'next/navigation';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import EntryControlForm from 'components/forms/faultControl';
import { useSession } from 'next-auth/react';
import Card from 'components/card';
import { log } from 'utils';

export default function EntryControl() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryParams = useParams();
  const [isLoading, setIsloading] = useState(false);
  const [fault, setFault] = useState({} as any);
  const [faultcontrol, setFaultcontrol] = useState({} as any);
  const { data: session } = useSession();

  useEffect(() => {
    const getSingleFault = async () => {
      setIsloading(true);
      const { status, data } = await getFaultById(queryParams.id);
      if (status === 200) {
        setFault(data);
        setFaultcontrol(data?.faultControl[0]);
        setIsloading(false);
        return;
      }
      setIsloading(true);
      //TODO: handle error
    };
    if (queryParams.id) {
      getSingleFault();
    }
  }, [queryParams?.id]);

  const handleSubmit = async (val) => {
    const [values, isUpdate] = val;

    setIsSubmitting(true);
    if (isUpdate) {
      const resData: any = await updateFaultControl({
        ...values,
        ...{ updatedBy: session?.user?.name },
      });

      const { status, response } = resData;
      if (response?.error) {
        const { message, detail } = response?.error;
        toast.error('Hata oluştu!.' + message);
        log(detail);
        setIsSubmitting(false);
        return;
      }

      if (status === 200) {
        toast.success('Ürün kontrol güncelleme işlemi başarılı.');
        router.push('/admin/entry');
        setIsSubmitting(false);
        return;
      }
    }

    // add new entry control
    const resControl: any = await addControl({
      ...values,
      ...{ createdBy: session?.user?.name },
    });
    const { status, response } = resControl;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Hata oluştu!.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }
    if (status === 200) {
      toast.success('Ürün girişi kontrol işlemi başarılı.');
      router.push('/admin/entry');
      setIsSubmitting(false);
      return;
    }
  };

  return (
    <Card className="mx-auto mt-4 max-w-[800px] rounded-2xl bg-white px-8 py-10 dark:bg-[#111c44] dark:text-white">
      {isLoading ? (
        <LatestInvoicesSkeleton />
      ) : (
        <EntryControlForm
          title={'Ürün Girişi Kontrol Formu'}
          info={fault}
          data={faultcontrol}
          isSubmitting={isSubmitting}
          onSubmit={(...val) => handleSubmit(val)}
        />
      )}
    </Card>
  );
}
