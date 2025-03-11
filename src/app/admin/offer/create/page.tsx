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
import { getResError } from 'utils/responseError';

export default function Create() {
  const [customers, setCustomers] = useState([]);
  const [offerData, setOfferData] = useState({} as any);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getAllCustomer = async () => {
      try {
        const { data } = await getCustomers();
        setCustomers(
          data.sort((a, b) => (a.company_name > b.company_name ? 1 : -1)),
        );
      } catch (error) {
        const message = getResError(error?.message);
        toast.error(`${message}`);
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

    try {
      setIsSubmitting(true);
      await addOffer({
        ...val,
        docPath: newPdf.url,
      });

      setIsSubmitting(false);
      toast.success('Teklif oluşturma işlemi başarılı.');
      router.push('/admin/offer');
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setTimeout(() => {
        router.push('/admin/offer');
        setIsSubmitting(false);
      }, 4000);
    }
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
