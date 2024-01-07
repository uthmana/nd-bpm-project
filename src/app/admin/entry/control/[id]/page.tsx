'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getFaultById } from 'app/lib/apiRequest';
import { useParams, useRouter } from 'next/navigation';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import EntryControlForm from 'components/forms/faultControl';
import { addControl } from 'app/lib/apiRequest';

export default function EntryControl() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryParams = useParams();
  const [isLoading, setIsloading] = useState(false);
  const [fault, setFault] = useState({} as any);

  useEffect(() => {
    const getSingleFault = async () => {
      setIsloading(true);
      const { status, data } = await getFaultById(queryParams.id);
      if (status === 200) {
        setFault(data);
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
    setIsSubmitting(true);
    const { status, data, response } = await addControl(val);
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
    <div className="mx-auto mt-4 max-w-[700px] rounded-2xl bg-white px-8 py-10">
      {isLoading ? (
        <LatestInvoicesSkeleton />
      ) : (
        <EntryControlForm
          title={'Ürün Girişi Kontrol Formu'}
          info={fault}
          data={''}
          isSubmitting={isSubmitting}
          onSubmit={(val) => handleSubmit(val)}
        />
      )}
    </div>
  );
}
