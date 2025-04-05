'use client';

import React, { useState } from 'react';
import CustomerForm from 'components/forms/customer';
import { useRouter } from 'next/navigation';
import { addCustomer } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import Card from 'components/card';
import { getResError } from 'utils/responseError';

export default function Create() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (val) => {
    setIsSubmitting(true);
    try {
      await addCustomer(val);
      router.push('/admin/customer');
      toast.success('Yeni Müşteri bilgi başarılı ile oluşturuldu.');
      setIsSubmitting(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <Card extra="mt-12 mx-auto mt-4 max-w-[780px] rounded-2xl px-8 py-10 bg-white dark:bg-[#111c44] dark:text-white">
      <CustomerForm
        title="Müşteri Ekle"
        onSubmit={(val) => handleSubmit(val)}
        loading={isSubmitting}
      />
    </Card>
  );
}
