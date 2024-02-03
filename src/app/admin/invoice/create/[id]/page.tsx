'use client';
import React, { useEffect, useState } from 'react';
import InvoiceForm from 'components/forms/invoice';
import { useParams, useRouter } from 'next/navigation';
import { log, removeMillisecondsAndUTC } from 'utils';
import {
  addInvoice,
  getFinishedProcess,
  getInvoiceById,
  updateInvoice,
} from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import Card from 'components/card';

export default function Edit() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const queryParams = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [invoice, setInvoice] = useState([]);

  // useEffect(() => {
  //   const getAllFinishedProcess = async () => {
  //     const finishedProcess: any = await getFinishedProcess();
  //     const { status, data, response } = finishedProcess;
  //     //TODO: handle error
  //     if (status === 200) {
  //       setCustomers(data);
  //     }
  //   };
  //   getAllFinishedProcess();
  // }, []);

  useEffect(() => {
    const getSingleInvoice = async (id) => {
      setIsLoading(true);
      const { status, data } = await getInvoiceById(id);
      if (status === 200) {
        const { customer, process } = data;
        setCustomers([{ customer, process }]);
        console.log({ data });
        setInvoice({
          ...data,
          invoiceDate: removeMillisecondsAndUTC(data.invoiceDate),
        });

        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    };
    if (queryParams.id) {
      getSingleInvoice(queryParams.id);
    }
  }, [queryParams?.id]);

  const handleSubmit = async (val) => {
    const [formData, isUpdate] = val;
    setIsSubmitting(true);
    const resData: any = await updateInvoice({
      ...formData,
      ...{ updatedBy: session?.user?.name },
    });
    const { status, data, response } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Hata oluştu!.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      toast.success('İrsaliye oluşturma işlemi başarılı.');
      router.push(`/admin/invoice`);
      setIsSubmitting(false);
      return;
    }
  };

  return (
    <Card extra="mt-12 mx-auto mt-4 max-w-[800px] rounded-2xl px-8 py-10 bg-white dark:bg-[#111c44] dark:text-white">
      <InvoiceForm
        key={customers[0]}
        info={customers}
        editData={invoice}
        isSubmitting={isSubmitting}
        title="İrsaliye Oluşturma"
        onSubmit={(...val) => handleSubmit(val)}
      />
    </Card>
  );
}
