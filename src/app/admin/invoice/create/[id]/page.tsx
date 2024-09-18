'use client';
import React, { useEffect, useState } from 'react';
import InvoiceForm from 'components/forms/invoice';
import { useParams, useRouter } from 'next/navigation';
import { log, postToLogo, removeMillisecondsAndUTC } from 'utils';
import {
  getCustomerById,
  getInvoiceById,
  postlogoDispatch,
  updateInvoice,
} from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import Card from 'components/card';
import { FormSkeleton } from 'components/skeleton';

export default function Edit() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const queryParams = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [invoice, setInvoice] = useState([]);

  useEffect(() => {
    const getSingleInvoice = async (id) => {
      setIsLoading(true);
      const { status, data } = await getInvoiceById(id);
      if (status === 200) {
        const { customer, process } = data;
        setCustomers([{ customer, process }]);
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
      status: 'ACTIVE',
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
      console.log(formData);
      //Post To LOGO
      //Get the Customer Code to use for sending to Logo

      const customerinfo = await getCustomerById(formData.customerId);
      if (customerinfo.response.status == 200) {
        console.log(customerinfo.response.data);
      }

      const logodata = {
        INTERNAL_REFERENCE: null,
        GRPCODE: 2,
        TYPE: 8,
        IOCODE: 3,
        NUMBER: `TEST.FromND1${new Date().toISOString()}1`,
        DATE: '2024-10-02T00:00:00', //formData.invoiceDate
        //NUMBER: '~',

        DOC_NUMBER: `SİLMEYİN11Test${formData.barcode}`,

        ARP_CODE: 'S.00055', //customerinfo.response.data.code

        CANCELLED: 1,

        PRINT_COUNTER: 0,

        CURRSEL_TOTALS: 1,

        TRANSACTIONS: {
          UPDCURR: 1,
          UPDTRCURR: 1,

          DISP_STATUS: 1,

          CANCEL_EXP: 'test amaçlı kesilmiştir.',

          VATEXCEPT_REASON: 'bedelsiz',
          TAX_FREE_CHECK: 0,
          TOTAL_NET_STR: 'Sıfır TL',
          IS_OKC_FICHE: 0,
          LABEL_LIST: {},
        },
      };

      const respponse = await postlogoDispatch(JSON.stringify(logodata));
      console.log(respponse);
      //  const resposne = await postToLogo(JSON.stringify(logodata));

      toast.success('İrsaliye oluşturma işlemi başarılı.');
      router.push(`/admin/invoice`);
      setIsSubmitting(false);
      return;
    }
  };

  return (
    <Card extra="mt-12 mx-auto mt-4 max-w-[780px] rounded-2xl px-8 py-10 bg-white dark:bg-[#111c44] dark:text-white">
      {isLoading ? (
        <FormSkeleton />
      ) : (
        <InvoiceForm
          key={customers[0]}
          info={customers}
          editData={invoice}
          isSubmitting={isSubmitting}
          title="İrsaliye Düzenleme"
          onSubmit={(...val) => handleSubmit(val)}
        />
      )}
    </Card>
  );
}
