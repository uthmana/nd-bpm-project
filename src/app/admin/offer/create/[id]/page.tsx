'use client';
import React, { useEffect, useState } from 'react';
import OfferDoc from 'components/offer';
import DetailHeader from 'components/detailHeader';
import OfferForm from 'components/forms/offer';
import { getCustomers, updateOffer, getOfferById } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import { removeMillisecondsAndUTC } from 'utils';
import { useRouter } from 'next/navigation';

export default function Create() {
  const [customers, setCustomers] = useState([]);
  const [offerData, setOfferData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryParams = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const [offerResponse, customerResponse] = await Promise.all([
        getOfferById(queryParams?.id),
        getCustomers(),
      ]);
      const { status: offerStatus, data: offerData } = offerResponse;
      const { status: custStatus, data: custData } = customerResponse;
      if (offerStatus === 200 && custStatus === 200) {
        setCustomers(custData);
        const customerName = offerData.Customer.company_name;
        setOfferData({
          ...offerData,
          customerName,
          company_name: customerName,
          startDate: removeMillisecondsAndUTC(offerData.startDate),
          endDate: removeMillisecondsAndUTC(offerData.endDate),
        });
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [queryParams?.id]);

  const handleSubmit = async (val) => {
    delete val.company_name;
    delete val.companyName;
    delete val.customerName;

    delete val.Customer;
    setIsSubmitting(true);
    const { status, data } = await updateOffer(val);
    if (status === 200) {
      toast.success('Teklif düzenleme işlemi başarılı.');
      router.push('/admin/offer');
    }
    setIsSubmitting(false);
  };

  const handleChange = (val) => {
    setOfferData(val);
  };

  const detailData = {
    title: 'Teklif Düzenleme',
    seeAllLink: '/admin/offer',
    seeAllText: 'Tüm Teklifler',
  };

  return (
    <>
      <div className="mx-auto max-w-[1200px]">
        <DetailHeader {...detailData} />
      </div>

      <div className="mx-auto flex w-full max-w-[1200px] flex-col-reverse gap-2 lg:flex-row">
        {isLoading ? (
          <LatestInvoicesSkeleton />
        ) : (
          <>
            {' '}
            <div className="w-full">
              <OfferDoc offer={offerData} />
            </div>
            <div className="w-full bg-white px-4 py-8">
              <OfferForm
                key={customers.length}
                info={customers}
                editData={offerData}
                onChange={handleChange}
                onSubmit={(val) => handleSubmit(val)}
                isSubmitting={isSubmitting}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
