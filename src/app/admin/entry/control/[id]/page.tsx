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
      const { status: controlStatus, data: controlData } =
        await getEntryControlByfaultId(queryParams.id);
      if (status === 200) {
        setFault(data);
        setFaultcontrol(controlData);
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
    // console.log(values, isUpdate);

    setIsSubmitting(true);
    if (isUpdate) {
      const { status, data, response } = await updateFaultControl({
        ...values,
        ...{ updatedBy: session?.user?.name },
      });
      if (status === 200) {
        toast.success('Ürün kontrol güncelleme işlemi başarılı.');
        router.push('/admin/entry');
        setIsSubmitting(false);
        return;
      }
      toast.error('Hata oluştu!.' + { response });
      setIsSubmitting(false);
      return;
    }

    // add new entry control
    const { status, data, response } = await addControl({
      ...values,
      ...{ createdBy: session?.user?.name },
    });
    if (status === 200) {
      toast.success('Ürün girişi kontrol işlemi başarılı.');
      router.push('/admin/entry');
      setIsSubmitting(false);
      return;
    }
    toast.error('Hata oluştu!.' + { response });
    setIsSubmitting(false);
  };

  return (
    <Card className="mx-auto mt-4 max-w-[700px] rounded-2xl bg-white px-8 py-10 dark:bg-[#111c44] dark:text-white">
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
