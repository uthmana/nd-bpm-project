'use client';
import React, { useEffect, useState } from 'react';
import OfferDoc from 'components/offer';
import DetailHeader from 'components/detailHeader';
import OfferForm from 'components/forms/offer';
import {
  getCustomers,
  updateOffer,
  getOfferById,
  addOffer,
} from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import { log, removeMillisecondsAndUTC, formatCurrency } from 'utils';
import { useRouter } from 'next/navigation';
import Card from 'components/card';
import UploadOfferPDF from 'components/offer/pdfDoc';
import { getResError } from 'utils/responseError';

export default function Create() {
  const [customers, setCustomers] = useState([]);
  const [offerData, setOfferData] = useState({} as any);
  const [offerItemData, setOfferItemData] = useState([] as any);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryParams = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offerResponse, customerResponse] = await Promise.all([
          getOfferById(queryParams?.id),
          getCustomers(),
        ]);
        const { data: offerData } = offerResponse;
        const { data: custData } = customerResponse;
        setCustomers(custData);
        const customerName = offerData.Customer.company_name;
        const offerProduct = offerData?.product.map((item) => {
          return {
            ...item,
            price: formatCurrency(item.price),
            quantity: formatCurrency(item.quantity, 'int'),
            unitPrice: formatCurrency(parseFloat(item.unitPrice)),
          };
        });
        setOfferItemData(offerProduct);

        setOfferData({
          ...offerData,
          customerName,
          product: offerProduct,
          company_name: customerName,
          totalAmount: formatCurrency(parseFloat(offerData.totalAmount)),
          startDate: removeMillisecondsAndUTC(offerData.startDate),
          endDate: removeMillisecondsAndUTC(offerData.endDate),
        });

        setIsLoading(false);
      } catch (error) {
        const message = getResError(error?.message);
        toast.error(`${message}`);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [queryParams?.id]);

  const handleSubmit = async ([val, isEdit]) => {
    delete val.company_name;
    delete val.companyName;
    delete val.customerName;
    delete val.Customer;

    let newPdf = val.docPath;
    setIsSubmitting(true);
    if (offerItemData?.length !== val.product?.length) {
      const newPdf = await UploadOfferPDF({ offer: val });

      if (newPdf.status !== 200) {
        toast.error('PDf Oluşturmada hata oluştu. Daha sonra tekrar deneyin!');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      if (isEdit) {
        await updateOffer({
          ...val,
          docPath: newPdf.url,
        });

        toast.success('Teklif düzenleme işlemi başarılı.');
        router.push('/admin/offer');
        setIsSubmitting(false);
        return;
      }

      //Create new offer from old data
      delete val.id;
      delete val.status;
      const product = val.product?.map((item) => {
        const { name, application, standard, quantity, price } = item;
        return { name, application, standard, quantity, price };
      });

      await addOffer({ ...val, product });

      toast.success('Teklif oluşturma işlemi başarılı.');
      setIsSubmitting(false);
      router.push('/admin/offer');
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsSubmitting(false);
    }
  };

  const handleChange = (val) => {
    setOfferData({});
    setOfferData(val);
  };

  const detailData = {
    title: 'Teklif Düzenleme',
    seeAllLink: '/admin/offer',
    seeAllText: 'Tüm Teklifler',
  };

  return (
    <>
      <div className="mx-auto max-w-[1320px]">
        <DetailHeader {...detailData} />
      </div>

      <div className="mx-auto flex w-full max-w-[1320px] flex-col-reverse justify-center gap-2 xl:flex-row">
        {isLoading ? (
          <LatestInvoicesSkeleton />
        ) : (
          <>
            <div
              id="pdf-content"
              className="mx-auto w-full max-w-[700px] bg-white"
            >
              <OfferDoc key={offerData?.key} offer={offerData} />
            </div>
            <Card className="mx-auto w-full max-w-[700px] bg-white px-4 py-8 dark:bg-navy-700">
              <OfferForm
                key={customers.length}
                info={customers}
                editData={offerData}
                onChange={handleChange}
                onSubmit={(...val) => handleSubmit(val)}
                isSubmitting={isSubmitting}
              />
            </Card>
          </>
        )}
      </div>
    </>
  );
}
