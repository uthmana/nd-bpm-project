'use client';

import React, { useState } from 'react';
import CustomerForm from 'components/forms/customer';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { addCustomer } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import Card from 'components/card';

export default function Create() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (val) => {
    setIsSubmitting(true);
    const { status, data } = await addCustomer(val);
    if (status === 200) {
      router.push('/admin/customer');
      toast.success('Yeni Müşteri bilgi başarılı ile oluşturuldu.');
      setIsSubmitting(false);
      return;
    }
    toast.error('Beklenmeyen bir hata oluştu.');
    setIsSubmitting(false);
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
