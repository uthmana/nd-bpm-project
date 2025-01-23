'use client';

import {
  getBarcodeBase64,
  getInvoiceById,
  postlogoDispatch,
  sendInvoice,
  updateInvoice,
} from 'app/lib/apiRequest';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MdOutlinePayment, MdPrint } from 'react-icons/md';
import InvoiceDoc from 'components/invoice';
import Button from 'components/button/button';
import DetailHeader from 'components/detailHeader';
import InputField from 'components/fields/InputField';
import { toast } from 'react-toastify';
import { log } from 'utils';
import UploadInvoicePDF from 'components/invoice/invoicePdf';
import ApiClient, { ClientInfo } from 'utils/logorequests';
import { env } from 'process';

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

  const SendDispatchToLogo = async () => {
    if (!invoice) {
      return;
    }

    //At maximum it accepts 10 characters. the Invoice number needs to be unique. It will be changed to use their invoice scheme if all is ready to be used
    function generateUniqueId() {
      const prefix = 'TES';
      const timestamp = Date.now().toString(); // Current time in milliseconds
      const randomSuffix = Math.floor(100 + Math.random() * 900); // Random 3-digit number
      return `${prefix}${timestamp.slice(-7)}${randomSuffix}`;
    }

    const logodata = {
      INTERNAL_REFERENCE: null,
      GRPCODE: 2,
      TYPE: 8,
      IOCODE: 3,
      NUMBER: `${generateUniqueId()}`,
      DATE: '2024-10-02T00:00:00', //formData.invoiceDate
      //NUMBER: '~',

      DOC_NUMBER: `SİLMEYİN11Test${invoice.barcode}`,

      ARP_CODE: invoice.customer.code, //'S.00055', //customerinfo.response.data.code

      CANCELLED: 1,

      PRINT_COUNTER: 0,

      CURRSEL_TOTALS: 1,
      TRANSACTIONS: {
        items: [
          {
            TYPE: 0,
            QUANTITY: invoice.process[0].quantity,
            MASTER_CODE: invoice.process[0].productCode,
            DISP_STATUS: 1,
            CANCEL_EXP: 'test amaçlı kesilmiştir.',
            VATEXCEPT_REASON: 'bedelsiz',
            UNIT_CODE: 'ADET',
            TAX_FREE_CHECK: 0,
            TOTAL_NET_STR: 'Sıfır TL',
            IS_OKC_FICHE: 0,
            LABEL_LIST: {},
          },
        ],
      },
      EDESPATCH: 1,
      EDESPATCH_PROFILEID: 1,
      EINVOICE: 1,
      EINVOICE_PROFILEID: 1,
      EINVOICE_DRIVERNAME1: '.',
      EINVOICE_DRIVERSURNAME1: '.',
      EINVOICE_DRIVERTCKNO1: '.',
      EINVOICE_PLATENUM1: '.',
      EINVOICE_CHASSISNUM1: '.',
    };

    const respponse = await postlogoDispatch(JSON.stringify(logodata));
    return respponse;
  };
  const handleSendEmail = async () => {
    setIsSubmiting(true);

    if (!invoice.id) return;
    const { data: barcodeData, status: barcodeStatus } = await getBarcodeBase64(
      {
        code: invoice.barcode,
      },
    );
    if (barcodeStatus !== 200) return;
    const newPdf = await UploadInvoicePDF({
      invoice: { ...invoice, barcodeImage: barcodeData.code },
    });

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
    //send To Logo
    //Logoya gönderme
    try {
      const logores = await SendDispatchToLogo();

      console.log('Logo sonucu' + logores);
      if (logores != null) {
        // const logoresJson = await logores.json();
        console.log(logores.NUMBER);
        toast.success(`Logoya gönderme işlemi başarılı ${logores.NUMBER}`);
        console.log(`Logoya gönderme sonucu:`);
      } else {
        //const logoresText = await logores.text();
        const logoresJson = await logores.json();
        toast.error(
          `Logoya başarıyla içeriye alamadı ${logoresJson.response.data}`,
        );
      }
    } catch (error) {
      console.error('Logoya gönderme hatası:', error);
      toast.error(`Logoya başarıyla içeriye alamadı: ${error}`);
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
              disabled={invoice.status === 'PAID'}
              loading={isInvoiceSubmiting}
            />
          </div>
        </div>
      )}
    </div>
  );
}
