'use client';
import React, { useState } from 'react';
import StockForm from 'components/forms/stock';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { addStock } from '../../../lib/apiRequest';
import { toast } from 'react-toastify';
import Card from 'components/card';

export default function Edit() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (val) => {
    setIsSubmitting(true);
    const resData: any = await addStock({
      ...val,
      inventory: parseInt(val.inventory),
    });
    const { status, response } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Ürün ekleme işlemi başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }
    if (status === 200) {
      toast.success('Stok ekleme işlemi başarılı.');
      router.push('/admin/stock');
      setIsSubmitting(false);
      return;
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
