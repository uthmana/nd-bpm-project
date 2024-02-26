'use client';
import React, { useEffect, useState } from 'react';
import OfferDoc from 'components/offer';
import DetailHeader from 'components/detailHeader';
import OfferForm from 'components/forms/offer';
import { getCustomers, addOffer } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { log } from 'utils';

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
    delete val.company_name;
    delete val.companyName;
    setIsSubmitting(true);
    const addOfferResponse: any = await addOffer(val);
    const { status, data, response } = addOfferResponse;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Hata oluştu!.' + message);
      log(detail);
      setIsSubmitting(false);
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
      <div className="mx-auto max-w-[1200px]">
        <DetailHeader {...detailData} />
      </div>

      <div className="mx-auto flex w-full max-w-[1200px] flex-col-reverse gap-2 lg:flex-row">
        <div className="w-full">
          <OfferDoc offer={offerData} />
        </div>
        <div className="w-full bg-white px-4 py-8">
          <OfferForm
            key={customers.length}
            info={customers}
            onChange={handleChange}
            onSubmit={(val) => handleSubmit(val)}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </>
  );
}
