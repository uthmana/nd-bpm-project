'use client';
import React, { useEffect, useState } from 'react';
import StockForm from 'components/forms/stock';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { addStock, getCustomers } from '../../../lib/apiRequest';
import { toast } from 'react-toastify';

export default function Edit() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsloading] = useState(false);

  const getAllCustomers = async () => {
    setIsloading(true);
    const { status, data } = await getCustomers();
    if (status === 200) {
      setCustomers(data);
    }
    setIsloading(false);
  };

  useEffect(() => {
    getAllCustomers();
  }, []);

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
    <div className="mt-12">
      <StockForm
        loading={isSubmitting}
        title="Stok Ekle"
        onSubmit={(val) => handleSubmit(val)}
        customerData={customers}
      />
    </div>
  );
}
