'use client';
import React, { useEffect, useState } from 'react';
import StockForm from 'components/forms/stock';
import { useParams, useRouter } from 'next/navigation';
import { log } from 'utils';
import { toast } from 'react-toastify';
import { getCustomers, getStockById, updateStock } from 'app/lib/apiRequest';
import { UserFormSkeleton } from 'components/skeleton';
import Card from 'components/card';

export default function Edit() {
  const router = useRouter();

  const queryParams = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stock, setStock] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Use Promise.all to fetch both stock and customers simultaneously
        const [stockResponse, customersResponse] = await Promise.all([
          getStockById(queryParams.id),
          getCustomers(),
        ]);

        const { status: stockStatus, data } = stockResponse;
        const { status, data: customerData } = customersResponse;

        if (stockStatus === 200 && status === 200) {
          setStock({ ...data, company_name: data.customer?.company_name });
          setCustomers(customerData);
        } else {
          setIsSubmitting(false);
        }
      } catch (error) {
        // Handle errors if any
        console.error('Error fetching data:', error);
      } finally {
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
    </Card>
  );
}
