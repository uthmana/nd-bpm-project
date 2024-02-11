'use client';
import React, { useState } from 'react';
import CustomerForm from 'components/forms/customer';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { addCustomer } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';

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
    <div className="mt-12">
      <CustomerForm
        title="Müşteri Ekle"
        onSubmit={(val) => handleSubmit(val)}
        loading={isSubmitting}
      />
    </div>
  );
}
