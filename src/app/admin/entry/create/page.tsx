'use client';
import React, { useState } from 'react';
import FaultForm from 'components/forms/fault';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { addFault } from '../../../lib/apiRequest';
import { toast } from 'react-toastify';

export default function Edit() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (val) => {
    setIsSubmitting(true);
    const { status, data, response } = await addFault(val);
    if (status === 200) {
      toast.success('Ürün girişi ekleme işlemi başarılı.');
      router.push('/admin/entry');
      setIsSubmitting(false);
      return;
    }
    toast.error('Hata oluştu!.' + { response });
    setIsSubmitting(false);
  };

  return (
    <div className="mt-12">
      <FaultForm
        loading={isSubmitting}
        title="Ürün Girişi Ekle"
        onSubmit={(val) => handleSubmit(val)}
      />
    </div>
  );
}
