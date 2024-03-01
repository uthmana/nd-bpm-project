'use client';
import React, { useEffect, useState } from 'react';
import CustomerForm from 'components/forms/customer';
import { useParams, useRouter } from 'next/navigation';
import { log } from 'utils';
import { getCustomerById, updateCustomer } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import { FormSkeleton } from 'components/skeleton';
import Card from 'components/card';

export default function Edit() {
  const router = useRouter();
  const queryParams = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    const getSingleCustomer = async () => {
      setIsloading(true);
      const { status, data } = await getCustomerById(queryParams.id);
      if (status === 200) {
        setCustomer(data);
        setIsloading(false);
        return;
      }
      setIsloading(false);
      //TODO: handle error
    };
    if (queryParams.id) {
      getSingleCustomer();
    }
  }, [queryParams?.id]);

  const handleSubmit = async (val: any) => {
    setIsSubmitting(true);
    if (!val) return;
    const { status, data } = await updateCustomer({
      ...val,
      id: queryParams?.id,
    });
    if (status === 200) {
      toast.success('Müşteri bilgi güncelleme başarılı.');
      router.push('/admin/customer');
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    toast.error('Müşteri bilgi güncelleme başarısız.');
  };

  return (
    <Card extra="mt-12 mx-auto mt-4 max-w-[780px] rounded-2xl px-8 py-10 bg-white dark:bg-[#111c44] dark:text-white">
      {isLoading ? (
        <div className="w-full">
          <FormSkeleton />
        </div>
      ) : (
        <CustomerForm
          title="Müşteri Bilgileri Güncelleme"
          loading={isSubmitting}
          onSubmit={(val) => handleSubmit(val)}
          data={customer as any}
        />
      )}
    </Card>
  );
}
