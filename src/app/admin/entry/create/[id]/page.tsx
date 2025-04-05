'use client';
import React, { useEffect, useState } from 'react';
import FaultForm from 'components/forms/fault';
import { useParams, useRouter } from 'next/navigation';
import { formatCurrency, removeMillisecondsAndUTC } from 'utils';
import { toast } from 'react-toastify';
import {
  getFaultById,
  sendNotification,
  updateFault,
} from 'app/lib/apiRequest';
import { FormSkeleton } from 'components/skeleton';
import { useSession } from 'next-auth/react';
import Card from 'components/card';
import DetailHeader from 'components/detailHeader';
import { getResError } from 'utils/responseError';

export default function Edit() {
  const router = useRouter();
  const { data: session } = useSession();
  const queryParams = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fault, setFault] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const detailData = {
    title: '',
    seeAllLink: '/admin/entry',
    seeAllText: 'Tüm Ürünler Girişleri',
  };

  useEffect(() => {
    const getSingleFault = async () => {
      try {
        setIsLoading(true);
        const { data } = await getFaultById(queryParams.id);
        const customerName = data?.customer.company_name;
        const customerId = data?.customer.id;

        delete data.faultControl;
        delete data.customer;

        setFault({
          ...data,
          customerName,
          customerId,
          quantity: formatCurrency(data.quantity, 'int'),
          arrivalDate: removeMillisecondsAndUTC(data.arrivalDate),
        });
        setIsLoading(false);
      } catch (error) {
        const message = getResError(error?.message);
        toast.error(`${message}`);
        setIsLoading(true);
      }
    };
    if (queryParams.id) {
      getSingleFault();
    }
  }, [queryParams?.id]);

  const handleSubmit = async (val) => {
    setIsSubmitting(true);
    if (!val) return;
    const newVal = { ...val, ...{ updatedBy: session?.user?.name } };

    try {
      const { data } = await updateFault({
        ...newVal,
        id: queryParams?.id,
      });
      await sendNotification({
        workflowId: 'fault-entry',
        data: {
          link: `${window?.location.origin}/admin/entry/${data.id}`,
          title: 'Ürün Girişi Güncelleme',
          description: `${data?.customer?.company_name} için ${data?.product} ürününün güncellenmiştir.`,
        },
      });

      toast.success('Ürün güncelleme başarılı.');
      router.push(`/admin/entry/${queryParams?.id}`);
      setIsSubmitting(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-[780px]  bg-white  dark:bg-[#111c44] dark:text-white">
        <DetailHeader {...detailData} />
      </div>

      <Card extra="mt-12 mx-auto mt-4 max-w-[780px] rounded-2xl px-8 py-10 bg-white dark:bg-[#111c44] dark:text-white">
        {isLoading ? (
          <FormSkeleton />
        ) : (
          <FaultForm
            title="Ürün Düzenle"
            onSubmit={(val) => handleSubmit(val)}
            editData={fault as any}
            loading={isSubmitting}
          />
        )}
      </Card>
    </div>
  );
}
