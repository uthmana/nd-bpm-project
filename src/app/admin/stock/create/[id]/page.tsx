'use client';

import React, { useEffect, useState } from 'react';
import StockForm from 'components/forms/stock';
import { useParams, useRouter } from 'next/navigation';
import { log } from 'utils';
import { toast } from 'react-toastify';
import { getStockById, updateStock } from 'app/lib/apiRequest';
import { FormSkeleton } from 'components/skeleton';
import Card from 'components/card';

export default function Edit() {
  const router = useRouter();
  const queryParams = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stock, setStock] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await getStockById(queryParams.id);
        setStock({ ...data, company_name: data.customer?.company_name });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    if (queryParams.id) {
      fetchData();
    }
  }, [queryParams?.id]);

  const handleSubmit = async (val) => {
    setIsSubmitting(true);
    if (!val) return;
    delete val.customer;
    const resData: any = await updateStock({ ...val, id: queryParams?.id });
    const { status, response } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Ürün güncelleme başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }
    if (status === 200) {
      toast.success('Ürün güncelleme başarılı.');
      router.push('/admin/stock');
      setIsSubmitting(false);
      return;
    }
  };

  return (
    <Card extra="mt-12 mx-auto mt-4 max-w-[780px] rounded-2xl px-8 py-10 bg-white dark:bg-[#111c44] dark:text-white">
      {isLoading ? (
        <div className="w-full">
          <FormSkeleton />
        </div>
      ) : (
        <StockForm
          title="Stok Düzenle"
          onSubmit={(val) => handleSubmit(val)}
          data={stock as any}
          loading={isSubmitting}
        />
      )}
    </Card>
  );
}
