'use client';
import React, { useEffect, useState } from 'react';
import OfferDoc from 'components/offer';
import DetailHeader from 'components/detailHeader';
import { updateOffer, getOfferById } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import Button from 'components/button/button';
import { MdOutlinePayment, MdPrint } from 'react-icons/md';
import { OfferObj } from 'app/localTypes/table-types';
import { log } from 'utils';
// import OfferTemplete from 'emails/offer';
// import ReactDOMServer from 'react-dom/server';

export default function Create() {
  const [offerData, setOfferData] = useState({} as OfferObj);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryParams = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const getSingleOffer = async (id) => {
    setIsLoading(true);
    const { status, data } = await getOfferById(id);
    if (status === 200) {
      setOfferData(data.find((item) => item.id === id));
      setIsLoading(false);
      return;
    }
  };

  useEffect(() => {
    if (queryParams?.id) {
      getSingleOffer(queryParams?.id);
    }
  }, [queryParams?.id]);

  const handlePrint = () => {
    window.print();
  };

  const onOfferComplete = async () => {
    setIsSubmitting(true);
    const updateResponse: any = await updateOffer({
      ...offerData,
      status: 'SENT',
    });
    const { status, data, response } = updateResponse;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Hata oluştu!.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }
    toast.success('Teklif gönderme işlemi başarılı');
    getSingleOffer(data?.id);
    return;
  };

  let detailData = {
    title: 'Teklif Detayi',
    seeAllLink: '/admin/offer',
    seeAllText: 'Tüm Teklifler',
  };

  if (offerData?.status !== 'SENT') {
    detailData = {
      ...detailData,
      ...{
        actionLink: `/admin/offer/create/${queryParams?.id}`,
        actionText: 'DÜZENLE',
      },
    };
  }

  return (
    <>
      <div className="mx-auto max-w-[1200px]">
        <DetailHeader {...detailData} />
      </div>

      <div className="mx-auto flex w-full max-w-[1200px] flex-col justify-between gap-4  lg:flex-row">
        <div className="page-break min-h-[800px]  w-full  bg-white px-10 lg:w-[700px] lg:max-w-[700px]  print:absolute print:top-0 print:z-[99999] print:min-h-screen print:w-full print:pl-0 print:pr-8">
          {/* <iframe
              width="100%"
              height="1000px"
              srcDoc={ReactDOMServer.renderToString(
                <OfferTemplete offer={offerData} />,
              )}
            ></iframe> */}
          <OfferDoc offer={offerData} />
        </div>
        <div className="flex w-full flex-col gap-4 bg-white px-4 py-8 xl:w-1/3">
          <Button
            extra="px-8 h-[40px] max-w-[200px]"
            onClick={handlePrint}
            text="YAZDIR"
            icon={<MdPrint className="mr-1 h-5 w-5" />}
          />
          <Button
            extra={`px-8 h-[40px]  max-w-[200px] ${
              offerData.status === 'SENT' ? 'opacity-25' : ''
            }`}
            onClick={onOfferComplete}
            text={`${offerData.status !== 'SENT' ? 'GÖNDER' : 'GÖNDERİLDİ'}`}
            icon={<MdOutlinePayment className="mr-1 h-5 w-5" />}
            disabled={offerData.status === 'SENT'}
            loading={isSubmitting}
          />
        </div>
      </div>
    </>
  );
}
