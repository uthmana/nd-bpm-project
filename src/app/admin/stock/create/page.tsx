'use client';
import React, { useState } from 'react';
import StockForm from 'components/forms/stock';
import { useRouter } from 'next/navigation';
import { addStock } from '../../../lib/apiRequest';
import { toast } from 'react-toastify';
import Card from 'components/card';
import { getResError } from 'utils/responseError';

export default function Edit() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (val) => {
    try {
      setIsSubmitting(true);
      await addStock({
        ...val,
        inventory: parseInt(val.inventory),
      });

      toast.success('Stok ekleme işlemi başarılı.');
      router.push('/admin/stock');
      setIsSubmitting(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <Card extra="mt-12 mx-auto mt-4 max-w-[780px] rounded-2xl px-8 py-10 bg-white dark:bg-[#111c44] dark:text-white">
      <StockForm
        loading={isSubmitting}
        title="Stok Ekle"
        onSubmit={(val) => handleSubmit(val)}
      />
    </Card>
  );
}
