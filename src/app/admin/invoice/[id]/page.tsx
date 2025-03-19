'use client';

import {
  addInvoice,
  getBarcodeBase64,
  getCustomersWithFilter,
  getInvoiceById,
  sendInvoice,
  updateInvoice,
} from 'app/lib/apiRequest';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MdOutlinePayment, MdPrint } from 'react-icons/md';
import InvoiceDoc from 'components/invoice';
import Button from 'components/button';
import DetailHeader from 'components/detailHeader';
import InputField from 'components/fields/InputField';
import { toast } from 'react-toastify';
import { generateSKU, log } from 'utils';
import UploadInvoicePDF from 'components/invoice/invoicePdf';
import { useSession } from 'next-auth/react';
import { sendDispatchToLogo } from 'app/lib/logoRequest';
import { Invoice } from 'app/localTypes/types';
import { getResError } from 'utils/responseError';

export default function Invoices() {
  const [isLoading, setIsLoading] = useState(false);
  const [invoice, setInvoice] = useState({} as Invoice | any);
  const [value, setValues] = useState({} as { email: String });
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isInvoiceSubmiting, setIsInvoiceSubmiting] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const queryParams = useParams();
  const newinvoice = searchParams.get('newinvoice');

  const detailData = {
    title: 'İrsaliye Detayi',
    seeAllLink: '/admin/invoice',
    seeAllText: 'Tüm İrsaliye',
  };

  const getSingleInvoice = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await getInvoiceById(id);
      setInvoice(data);
      setValues({ email: data?.customer?.email });
      setIsLoading(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(message);
      setIsLoading(false);
    }
  };
  const getNewInvoice = async (id) => {
    try {
      const { data } = await getCustomersWithFilter({
        where: {
          id: id,
        },
        include: {
          Fault: {
            where: { status: 'IRSALIYE_KESIMI_BEKLENIYOR' },
          },
        },
      });
      const { Fault, ...rest } = data[0];
      setInvoice({
        customer: rest,
        Fault,
        createdAt: new Date(),
        invoiceDate: new Date(),
        barcode: generateSKU('IRS', rest.company_name, Fault?.length),
      });
      setValues({ email: rest?.email });
    } catch (err) {
      const message = getResError(err?.message);
      toast.error(message);
    }
  };

  useEffect(() => {
    if (!queryParams?.id) return;
    if (newinvoice && newinvoice === 'true') {
      getNewInvoice(queryParams?.id);
    } else {
      getSingleInvoice(queryParams?.id);
    }
  }, [queryParams?.id, newinvoice]);

  const handlePrint = () => {
    window.print();
  };
  const handleValues = (event) => {
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...value, ...newVal });
  };
  const handleSendEmail = async () => {
    try {
      setIsSubmiting(true);

      if (!invoice.id || !value.email) {
        setIsSubmiting(false);
        return;
      }
      let docPath = invoice?.docPath;
      if (!invoice?.docPath) {
        const { data: barcodeData } = await getBarcodeBase64({
          code: invoice.barcode,
        });
        const newPdf = await UploadInvoicePDF({
          invoice: { ...invoice, barcodeImage: barcodeData.code },
        });

        docPath = newPdf?.url;
        const { data } = await updateInvoice({
          ...invoice,
          docPath,
          updatedBy: session?.user?.name,
        });
        setInvoice(data);
      }

      const invoiceRes: any = await sendInvoice({
        type: 'invoice',
        email: value.email,
        subject: 'İrsaliye',
        data: invoice,
        text: '',
        docPath: docPath,
      });
      toast.success('İrsaliye e-posta gönderme işlemi başarılı');
      setIsSubmiting(false);
      router.push(`/admin/invoice`);
    } catch (error) {
      toast.error('Hata oluştu!.' + error);
      setIsSubmiting(false);
    }
  };
  const onInoviceComplete = async () => {
    setIsInvoiceSubmiting(true);

    try {
      let currentInvoice: Invoice;
      let docPath = invoice?.docPath;
      const invoiceData = {
        ...invoice,
        status: 'PAID',
      };

      // create invoice pdf
      if (!invoice?.docPath) {
        const { data: barcodeData } = await getBarcodeBase64({
          code: invoice.barcode,
        });
        const newPdf = await UploadInvoicePDF({
          invoice: { ...invoice, barcodeImage: barcodeData.code },
        });
        docPath = newPdf?.url;
      }

      if (!invoice?.id) {
        // Add invoice
        const { data } = await addInvoice({
          ...invoiceData,
          createdBy: session?.user?.name,
          docPath,
        });
        currentInvoice = data;
      } else {
        // Update invoice
        const { data } = await updateInvoice({
          ...invoiceData,
          id: queryParams?.id,
          docPath,
          updatedBy: session?.user?.name,
        });
        currentInvoice = data;
      }

      //send To Logo
      const { data }: any = await sendDispatchToLogo(currentInvoice);
      setIsInvoiceSubmiting(false);
      toast.success(`Logoya gönderme işlemi başarılı ${data.NUMBER}`);
      router.push(`/admin/invoice/${currentInvoice?.id}`);
    } catch (err) {
      const message = getResError(err?.message);
      toast.error(`Logoya başarıyla içeriye alamadı ${message}`);
      setIsInvoiceSubmiting(false);
      return;
    }
  };

  return (
    <div className="w-full">
      <div className="w-full lg:mx-auto lg:w-[1000px]">
        <DetailHeader {...detailData} />
      </div>

      {isLoading ? (
        <div className="w-full lg:mx-auto lg:w-[1000px]">
          <LatestInvoicesSkeleton />
        </div>
      ) : (
        <div className="flex w-full flex-wrap gap-5 lg:mx-auto lg:w-[1000px]">
          <div id="pdf-content">
            <InvoiceDoc invoice={invoice} />
          </div>

          <div className="flex min-h-[200px] w-[400px] flex-col gap-3 self-start bg-white px-2 py-4 lg:w-[calc(100%-700px)]">
            <div className="flex w-full flex-col gap-3 border-b px-3 py-4 text-sm">
              <h3 className="mb-2 border-b text-lg">Müşteri Bilgileri</h3>
              <div className="flex flex-col flex-nowrap">
                <h3 className="mb-0 italic">Müşteri</h3>
                <p className="font-bold">{invoice?.customer?.company_name}</p>
              </div>
              <div className="flex flex-col flex-nowrap">
                <h3 className="mb-0 italic">Kodu</h3>
                <p className="font-bold">{invoice?.customer?.code}</p>
              </div>
              <div>
                <h3 className="italic">Telefon</h3>
                <p className="font-bold">{invoice?.customer?.phoneNumber}</p>
              </div>
              <div>
                <h3 className="italic">E-posta</h3>
                <p className="font-bold">{invoice?.customer?.email}</p>
              </div>
            </div>

            <div className="flex w-full  flex-nowrap items-center gap-2 lg:flex-wrap">
              <InputField
                label="E-posta"
                onChange={handleValues}
                type="text"
                id="email"
                name="email"
                placeholder="E-posta"
                extra="mb-2 w-full mr-3"
                value={value.email}
              />
              <div className="w-[120px] pt-5 lg:w-full lg:pt-0">
                <Button
                  extra="h-[40px]"
                  onClick={handleSendEmail}
                  text="GÖNDER"
                  loading={isSubmiting}
                />
              </div>
            </div>

            <Button
              extra="px-8 h-[40px] max-w-[300px]"
              onClick={handlePrint}
              text="YAZDIR"
              icon={<MdPrint className="mr-1 h-5 w-5" />}
            />
            <Button
              extra={`px-8 h-[40px] max-w-[300px]`}
              onClick={onInoviceComplete}
              text={`SEVKİYAT ${
                invoice?.status !== 'PAID' ? 'TAMAMLA' : 'TAMAMLANDI'
              }`}
              icon={<MdOutlinePayment className="mr-1 h-5 w-5" />}
              disabled={invoice?.status === 'PAIDS'}
              loading={isInvoiceSubmiting}
            />
          </div>
        </div>
      )}
    </div>
  );
}
