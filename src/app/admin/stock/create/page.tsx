'use client';
import React, { useState } from 'react';
import StockForm from 'components/forms/stock';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { addStock } from '../../../lib/apiRequest';
import { toast } from 'react-toastify';

export default function Edit() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (val) => {
    setIsSubmitting(true);
    const { status, data, response } = await addStock({
      ...val,
      inventory: parseInt(val.inventory),
    });
    if (status === 200) {
      toast.success('Stok ekleme işlemi başarılı.');
      router.push('/admin/stock');
      setIsSubmitting(false);
      return;
    }
    toast.error('Hata oluştu!.' + { response });
    setIsSubmitting(false);
  };

  return (
    <div className="mt-12">
      <StockForm
        loading={isSubmitting}
        title="Stok Ekle"
        onSubmit={(val) => handleSubmit(val)}
      />
    </div>
  );
}
