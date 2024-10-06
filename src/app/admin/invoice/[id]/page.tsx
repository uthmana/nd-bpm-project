'use client';

import { getInvoiceById, sendInvoice, updateInvoice } from 'app/lib/apiRequest';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MdOutlinePayment, MdPrint } from 'react-icons/md';
import InvoiceDoc from 'components/invoice';
import Button from 'components/button/button';
import DetailHeader from 'components/detailHeader';
import InputField from 'components/fields/InputField';
import { toast } from 'react-toastify';
import { generateAndSendPDF, log } from 'utils';

export default function Invoice() {
  const [isLoading, setIsLoading] = useState(false);
  const [invoice, setInvoice] = useState({} as any);
  const [value, setValues] = useState({} as any);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isInvoiceSubmiting, setIsInvoiceSubmiting] = useState(false);
  const queryParams = useParams();

  const getSingleInvoice = async (id) => {
    setIsLoading(true);
    const { status, data } = await getInvoiceById(id);
    if (status === 200) {
      setInvoice(data);
      setValues({ email: data?.customer?.email });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (queryParams?.id) {
      getSingleInvoice(queryParams?.id);
    }
  }, [queryParams?.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleValues = (event) => {
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...value, ...newVal });
  };

  const handleSendEmail = async () => {
    setIsSubmiting(true);
    const newPdf = await generateAndSendPDF('pdf-content');
    if (newPdf.status !== 200) {
      toast.error('Hata oluştu. Daha sonra tekrar deneyin!');
      setIsSubmiting(false);
      return;
    }

    const invoiceRes: any = await sendInvoice({
      type: 'invoice',
      email: value.email,
      subject: 'İrsaliye',
      data: invoice,
      text: '',
      docPath: newPdf?.url,
    });
    const { status, response } = invoiceRes;

    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Hata oluştu!.' + message);
      log(detail);
      setIsSubmiting(false);
      return;
    }
    if (status === 200) {
      toast.success('İrsaliye gönderme işlemi başarılı');
    }
    setIsSubmiting(false);
  };

  const onInoviceComplete = async () => {
    setIsInvoiceSubmiting(true);
    const { status, data } = await updateInvoice({
      ...invoice,
      id: queryParams?.id,
      status: 'PAID',
    });

    if (status === 200) {
      getSingleInvoice(queryParams?.id);
    }
    setIsInvoiceSubmiting(false);
  };

  const detailData = {
    title: 'İrsaliye Detayi',
    seeAllLink: '/admin/invoice',
    seeAllText: 'Tüm İrsaliye',
    actionLink: '/admin/invoice/create/' + queryParams?.id,
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

          <div className="flex min-h-[200px] w-full flex-col gap-3 self-start bg-white px-2 py-4 lg:w-[calc(100%-700px)]">
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
              extra={`px-8 h-[40px] max-w-[300px] ${
                invoice.status === 'PAID' ? 'opacity-25' : ''
              }`}
              onClick={onInoviceComplete}
              text={`SEVKİYAT ${
                invoice.status !== 'PAID' ? 'TAMAMLA' : 'TAMAMLANDI'
              }`}
              icon={<MdOutlinePayment className="mr-1 h-5 w-5" />}
              disabled={invoice.status === 'PAIDs'}
              loading={isInvoiceSubmiting}
            />
          </div>
        </div>
      )}
    </div>
  );
}
