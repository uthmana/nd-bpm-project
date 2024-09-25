'use client';
import React, { useEffect, useState } from 'react';
import InvoiceForm from 'components/forms/invoice';
import { useParams, useRouter } from 'next/navigation';
import { log, postToLogo, removeMillisecondsAndUTC } from 'utils';
import { LogoDispatchDto, Transaction } from 'utils/logodispatch';
import { Prisma } from '@prisma/client';
import {
  getCustomerById,
  getInvoiceById,
  postlogoDispatch,
  saveLogoDispatch,
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

      const customerinfo = await getCustomerById(formData.customerId);
      if (customerinfo.response.status == 200) {
        console.log(customerinfo.response.data);
      }

      const customerData = customerinfo.response
        .data as Prisma.$CustomerPayload;
      console.log(customerData);
      const formDatatp = formData as Prisma.InvoiceGetPayload<{
        include: { customer: true; process: true };
      }>;
      console.log(formDatatp);
      console.log(formDatatp.process);
      console.log(formDatatp.customer.code);

      let transactions: Transaction[] = [];

      formDatatp.process.forEach((x) => {
        if (x.productCode) {
          transactions.push({
            Type: 0, // 0 for Material
            MASTER_CODE: x.productCode, //item (Material Code)
            PRICE: 100, //Material Price
            QUANTITY: 1, // Number of materials
            UNITCODE: 'ADET', // Unit code used
            //STOCKREF: 0, // MAY BE NEEDED TO BE FILLED
          });
        }
      });

      console.log(transactions);

      const logodata: LogoDispatchDto = {
        INTERNAL_REFERENCE: null,
        TYPE: 8, // 8 for salesdispatch
        ARP_CODE: formDatatp.customer.code, //Client Code
        NOTES1: 'Testing to see', // Açıklama
        //PAYMENT_CODE: 30, // Odeme Planı (1 month)
        DOC_DATE: formDatatp.invoiceDate.toString(), //Düzenleme Tarihi
        NUMBER: `TSET1${formDatatp.barcode}`,
        //NUMBER: '~',
        DATE: formDatatp.invoiceDate.toString(), //formDatatp.invoiceDate
        DOC_NUMBER: `SİLMEYİTest${formDatatp.barcode}`,
        TRANSACTIONS: transactions,
      };

      const logoresponse = await postlogoDispatch(JSON.stringify(logodata));

      if (logoresponse.status == 200) {
        const logoresponseData = logoresponse.response.data as LogoDispatchDto;
        //: Prisma.logoTransferGetPayload<{}>
        const logotransferdata = {
          DATE: logoresponseData.DATE,
          DOC_NUMBER: logoresponseData.DOC_NUMBER,
          INVOICE_NUMBER: formDatatp.id,
          NUMBER: logoresponseData.NUMBER,
          TYPE: logoresponseData.TYPE,
          transferType: 'SALES_DIPATCHES',
          INTERNAL_REF: logoresponseData.INTERNAL_REFERENCE,
        };

        console.log(logotransferdata);
        const savedinvoice = await saveLogoDispatch(
          JSON.stringify(logotransferdata),
        );
        console.log(savedinvoice);
        if (savedinvoice.response.status == 200) {
          const savedlog = savedinvoice.response.data;

          //as Prisma.$logoTransferPayload;
          /*
          alert(
            `  Logoya başarıyla ${savedlog.scalars.transferType} aktarıldı ve veri Tabanına Kaydedildi ${savedlog.id}`,
          );
          */
        }
      }

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
