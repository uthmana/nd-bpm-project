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
import UploadOfferPDF from 'components/offer/pdfDoc';

export default function Create() {
  const [customers, setCustomers] = useState([]);
  const [offerData, setOfferData] = useState({} as any);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getAllCustomer = async () => {
      const { status, data } = await getCustomers();

      if (status === 200) {
        setCustomers(
          data.sort((a, b) => (a.company_name > b.company_name ? 1 : -1)),
        );
      }
    };
    getAllCustomer();
  }, []);

  const handleSubmit = async (val) => {
    setIsSubmitting(true);
    const newPdf = await UploadOfferPDF({ offer: val });
    if (newPdf.status !== 200) {
      toast.error('Hata oluştu. Daha sonra tekrar deneyin!');
      setIsSubmitting(false);
      return;
    }

    delete val.company_name;
    delete val.companyName;
    setIsSubmitting(true);
    const addOfferResponse: any = await addOffer({
      ...val,
      docPath: newPdf.url,
    });
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
        <div id="pdf-content" className="mx-auto w-full max-w-[700px] bg-white">
          <OfferDoc key={offerData?.key} offer={offerData} />
        </div>
        <Card className="mx-auto w-full max-w-[700px] bg-white px-4 py-8 dark:bg-navy-700">
          <OfferForm
            key={customers?.length}
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
