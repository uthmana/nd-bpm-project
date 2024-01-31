'use client';
import React, { useEffect, useState } from 'react';
import InvoiceForm from 'components/forms/invoice';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { addInvoice, getFinishedProcess } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import Card from 'components/card';

export default function Edit() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const getAllFinishedProcess = async () => {
      const finishedProcess: any = await getFinishedProcess();
      const { status, data, response } = finishedProcess;
      //TODO: handle error
      if (status === 200) {
        setCustomers(data);
      }
    };
    getAllFinishedProcess();
  }, []);

  const handleSubmit = async (val) => {
    setIsSubmitting(true);
    const resData: any = await addInvoice({
      ...val,
      ...{ createdBy: session?.user?.name },
    });
    const { status, response } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Hata oluştu!.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      toast.success('İrsaliye oluşturma işlemi başarılı.');
      router.push('/admin/invoice');
      setIsSubmitting(false);
      return;
    }
  };

  return (
    <Card extra="mt-12 mx-auto mt-4 max-w-[700px] rounded-2xl px-8 py-10 bg-white dark:bg-[#111c44] dark:text-white">
      <InvoiceForm
        key={customers[0]}
        info={customers}
        isSubmitting={isSubmitting}
        title="İrsaliye Oluşturma"
        onSubmit={(val) => handleSubmit(val)}
      />
    </Card>
  );
}
