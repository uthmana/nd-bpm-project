'use client';
import React, { useEffect, useState } from 'react';
import FaultForm from 'components/forms/fault';
import { useParams, useRouter } from 'next/navigation';
import { log } from 'utils';
import { toast } from 'react-toastify';
import { getFaultById, updateFault } from 'app/lib/apiRequest';
import { FormSkeleton } from 'components/skeleton';
import { useSession } from 'next-auth/react';
import Card from 'components/card';

export default function Edit() {
  const router = useRouter();
  const { data: session } = useSession();
  const queryParams = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fault, setFault] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getSingleFault = async () => {
      setIsLoading(true);
      const { status, data } = await getFaultById(queryParams.id);
      if (status === 200) {
        delete data.faultControl;
        setFault(data);
        setIsLoading(false);
        return;
      }
      setIsSubmitting(false);
    };
    if (queryParams.id) {
      getSingleFault();
    }
  }, [queryParams?.id]);

  const handleSubmit = async (val) => {
    setIsSubmitting(true);
    if (!val) return;
    const newVal = { ...val, ...{ updatedBy: session?.user?.name } };

    const resData: any = await updateFault({
      ...newVal,
      id: queryParams?.id,
    });
    const { status, response } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Ürün güncelleme başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      toast.success('Ürün güncelleme başarılı.');
      router.push('/admin/entry');
      setIsSubmitting(false);
      return;
    }
  };

  return (
    <Card extra="mt-12 mx-auto mt-4 max-w-[780px] rounded-2xl px-8 py-10 bg-white dark:bg-[#111c44] dark:text-white">
      {isLoading ? (
        <FormSkeleton />
      ) : (
        <FaultForm
          title="Ürün Düzenle"
          onSubmit={(val) => handleSubmit(val)}
          editData={fault as any}
          loading={isSubmitting}
        />
      )}
    </Card>
  );
}
