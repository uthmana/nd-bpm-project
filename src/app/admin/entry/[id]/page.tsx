'use client';
import React, { useEffect, useState } from 'react';
import FaultForm from 'components/forms/fault';
import { useParams, useRouter } from 'next/navigation';
import { log } from 'utils';
import { toast } from 'react-toastify';
import { getFaultById, updateFault } from 'app/lib/apiRequest';
import { UserFormSkeleton } from 'components/skeleton';

export default function Edit() {
  const router = useRouter();

  const queryParams = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fault, setFault] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getSingleFault = async () => {
      setIsLoading(true);
      const { status, data } = await getFaultById(queryParams.id);
      if (status === 200) {
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
    const { status, data } = await updateFault({ ...val, id: queryParams?.id });
    if (status === 200) {
      toast.success('Ürün güncelleme başarılı.');
      router.push('/admin/entry');
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    toast.error('Ürün güncelleme başarısız.');
  };

  return (
    <div className="mt-12">
      {isLoading ? (
        <div className="mx-auto max-w-[600px]">
          <UserFormSkeleton />
        </div>
      ) : (
        <FaultForm
          title="Ürün Düzenle"
          onSubmit={(val) => handleSubmit(val)}
          data={fault as any}
          loading={isSubmitting}
        />
      )}
    </div>
  );
}
