'use client';
import React, { useState } from 'react';
import FaultForm from 'components/forms/fault';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { addFault, sendNotification } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import Card from 'components/card';

export default function Edit() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (val) => {
    setIsSubmitting(true);
    const resData: any = await addFault({
      ...val,
      ...{ createdBy: session?.user?.name },
    });
    const { status, response, data } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Hata oluştu!.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      try {
        await sendNotification({
          workflowId: 'fault-entry',
          data: {
            link: `${window?.location.origin}/admin/entry/${data.id}`,
          },
        });
      } catch (err) {
        console.log(err);
      }

      toast.success('Ürün girişi ekleme işlemi başarılı.');
      router.push('/admin/entry');
      setIsSubmitting(false);
      return;
    }
  };

  return (
    <Card extra="mt-12 mx-auto mt-4 max-w-[780px] rounded-2xl px-8 py-10 bg-white dark:bg-[#111c44] dark:text-white">
      <FaultForm
        loading={isSubmitting}
        title="Ürün Girişi Ekle"
        onSubmit={(val) => handleSubmit(val)}
      />
    </Card>
  );
}
