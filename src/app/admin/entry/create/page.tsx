'use client';
import React, { useState } from 'react';
import FaultForm from 'components/forms/fault';
import { useRouter } from 'next/navigation';
import { addFault, sendNotification } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import Card from 'components/card';
import DetailHeader from 'components/detailHeader';
import { getResError } from 'utils/responseError';

export default function Edit() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (val) => {
    setIsSubmitting(true);

    try {
      const { data } = await addFault({
        ...val,
        ...{ createdBy: session?.user?.name },
      });

      //Handle notification
      await sendNotification({
        workflowId: 'fault-entry',
        data: {
          link: `${window?.location.origin}/admin/entry/${data.id}`,
        },
      });

      toast.success('Ürün girişi ekleme işlemi başarılı.');
      router.push('/admin/entry');
      setIsSubmitting(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsSubmitting(false);
    }
  };

  const detailData = {
    title: '',
    seeAllLink: '/admin/entry',
    seeAllText: 'Tüm Ürünler Girişleri',
  };

  return (
    <div>
      <div className="mx-auto max-w-[780px]  bg-white  dark:bg-[#111c44] dark:text-white">
        <DetailHeader {...detailData} />
      </div>

      <Card extra="mt-12 mx-auto mt-4 max-w-[780px] rounded-2xl px-8 py-10 bg-white dark:bg-[#111c44] dark:text-white">
        <FaultForm
          loading={isSubmitting}
          title="Ürün Girişi Ekle"
          onSubmit={(val) => handleSubmit(val)}
        />
      </Card>
    </div>
  );
}
