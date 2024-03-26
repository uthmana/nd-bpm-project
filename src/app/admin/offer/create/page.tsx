'use client';
import React, { useEffect, useState } from 'react';
import OfferDoc from 'components/offer';
import DetailHeader from 'components/detailHeader';
import OfferForm from 'components/forms/offer';
import { getCustomers, addOffer } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import Card from 'components/card';
import OfferTemplete from 'emails/offer';
import ReactDOMServer from 'react-dom/server';
import html2PDF from 'jspdf-html2canvas';
import jsPDF from 'jspdf';

export default function Create() {
  const [customers, setCustomers] = useState([]);
  const [offerData, setOfferData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getAllCustomer = async () => {
      const { status, data } = await getCustomers();
      if (status === 200) {
        setCustomers(data);
      }
    };
    getAllCustomer();
  }, []);

  const handleSubmit = async (val) => {
    // const toHtml = ReactDOMServer.renderToString(
    //   <OfferTemplete offer={offerData} />,
    // );
    // const iframe =
    //   document.getElementById('page')?.contentWindow?.document.firstChild;
    // console.log(iframe);

    // var pdf = new jsPDF('p', 'pt', 'letter');
    // pdf.canvas.height = 72 * 11;
    // pdf.canvas.width = 72 * 8.5;
    // //  pdf.html(iframe);
    // pdf.html(toHtml).then(() => pdf.save('fileName.pdf'));

    // const pdf = await html2PDF(iframe as HTMLElement, {
    //   jsPDF: {
    //     format: 'a4',
    //   },
    //   imageType: 'image/jpeg',
    //   output: './pdf/generate.pdf',
    // });
    // console.log({ pdf });

    delete val.company_name;
    delete val.companyName;
    setIsSubmitting(true);
    const addOfferResponse: any = await addOffer(val);
    const { status, data, response } = addOfferResponse;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Teklif oluştu, E-posta gönderimde hata oluştu!.' + message);
      log(detail);
      setTimeout(() => {
        router.push('/admin/offer');
        setIsSubmitting(false);
      }, 4000);
      return;
    }

    if (status === 200) {
      toast.success('Teklif oluşturma işlemi başarılı.');
      router.push('/admin/offer');
    }
    setIsSubmitting(false);
  };

  const handleChange = (val) => {
    console.log(val);
    setOfferData(val);
  };

  const detailData = {
    title: 'Teklif Oluşturma',
    seeAllLink: '/admin/offer',
    seeAllText: 'Tüm Teklifler',
  };

  return (
    <>
      <div className="mx-auto max-w-[1320px]">
        <DetailHeader {...detailData} />
      </div>

      <div className="mx-auto flex w-full max-w-[1320px] flex-col-reverse justify-center gap-2 xl:flex-row">
        <div className="mx-auto w-full max-w-[700px] bg-white">
          {/* <OfferDoc offer={offerData} /> */}
          <div className="page-break min-h-[800px] w-full bg-white px-10 lg:w-[700px] lg:max-w-[700px] print:absolute  print:top-0 print:z-[99999] print:min-h-screen print:w-full print:pl-0 print:pr-8">
            <iframe
              id="page"
              width="100%"
              height="1000px"
              srcDoc={ReactDOMServer.renderToString(
                <OfferTemplete offer={offerData} />,
              )}
            ></iframe>
          </div>
        </div>
        <Card className="mx-auto w-full max-w-[700px] bg-white px-4 py-8 dark:bg-navy-700">
          <OfferForm
            key={customers.length}
            info={customers}
            onChange={handleChange}
            onSubmit={(val) => handleSubmit(val)}
            isSubmitting={isSubmitting}
          />
        </Card>
      </div>
    </>
  );
}
