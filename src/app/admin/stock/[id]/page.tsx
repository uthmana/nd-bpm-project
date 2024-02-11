'use client';
import React, { useEffect, useState } from 'react';
import StockForm from 'components/forms/stock';
import { useParams, useRouter } from 'next/navigation';
import { log } from 'utils';
import { toast } from 'react-toastify';
import { getCustomers, getStockById, updateStock } from 'app/lib/apiRequest';
import { UserFormSkeleton } from 'components/skeleton';

export default function Edit() {
  const router = useRouter();

  const queryParams = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stock, setStock] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const getSingleStock = async () => {
      setIsLoading(true);
      const { status: stockStatus, data } = await getStockById(queryParams.id);
      const { status, data: customerData } = await getCustomers();
      if (stockStatus === 200 && status === 200) {
        setStock(data);
        setCustomers(customerData);
        setIsLoading(false);
        return;
      }
      setIsSubmitting(false);
    };
    if (queryParams.id) {
      getSingleStock();
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
    <div className="mt-12">
      {isLoading ? (
        <div className="mx-auto max-w-[600px]">
          <UserFormSkeleton />
        </div>
      ) : (
        <StockForm
          title="Stok Düzenle"
          onSubmit={(val) => handleSubmit(val)}
          customerData={customers}
          data={stock as any}
          loading={isSubmitting}
        />
      )}
    </div>
  );
}
