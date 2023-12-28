'use client';
import React, { useEffect, useState } from 'react';
import StockForm from 'components/forms/stock';
import { useParams, useRouter } from 'next/navigation';
import { log } from 'utils';
import { toast } from 'react-toastify';
import { getStockById, updateStock } from 'app/lib/apiRequest';
import { UserFormSkeleton } from 'components/skeleton';

export default function Edit() {
  const router = useRouter();

  const queryParams = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stock, setStock] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getSingleStock = async () => {
      setIsLoading(true);
      const { status, data } = await getStockById(queryParams.id);
      if (status === 200) {
        setStock(data);
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
    const { status, data } = await updateStock({ ...val, id: queryParams?.id });
    if (status === 200) {
      toast.success('Ürün güncelleme başarılı.');
      router.push('/admin/stock');
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    toast.error('Ürün güncelleme başarısız.');
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
          data={stock as any}
          loading={isSubmitting}
        />
      )}
    </div>
  );
}
