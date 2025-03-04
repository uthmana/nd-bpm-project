'use client';

import { TableSkeleton } from 'components/skeleton';
import OfferTable from 'components/admin/data-tables/offerTable';
import { useRouter, useSearchParams } from 'next/navigation';
import { log } from 'utils';
import { useEffect, useState } from 'react';
import { deleteOffer, getOffer } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import Popup from 'components/popup';
import Button from 'components/button';
import { useSession } from 'next-auth/react';

const Offer = () => {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [offerId, setOfferId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const searchVal = searchParams.get('q');
  const [searchText, setSearchText] = useState(searchVal || '');

  const getAllOffer = async () => {
    setIsLoading(true);
    const { status, data } = await getOffer();
    if (status === 200) {
      const formatedData = data.map((item) => {
        return {
          ...item,
          customerName: item?.Customer?.company_name,
          products: item?.product
            ?.map((prod, idx) => {
              return `<div className='w-full flex gap-1'><span>${
                idx + 1
              }. </span> <span>${prod.application}</span></div>`;
            })
            .join(''),
        };
      });
      setOffers(formatedData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllOffer();
  }, []);

  const onAdd = () => {
    router.push('/admin/offer/create');
  };

  const onEdit = (val) => {
    router.push(`/admin/offer/create/${val}`);
  };

  const onControl = (val) => {
    router.push(`/admin/offer/${val}`);
  };

  const onComfirm = async (val) => {
    setOfferId(val);
    setIsShowPopUp(true);
  };

  const onDelete = async () => {
    setIsSubmitting(true);
    const resInvoice: any = await deleteOffer(offerId);

    const { status, response } = resInvoice;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Teklif silme işlemi başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      toast.success('Teklif silme işlemi başarılı.');
      setIsSubmitting(false);
      setIsShowPopUp(false);
      setOffers([]);
      getAllOffer();
      return;
    }
  };

  const handleClose = (val: string) => {
    setIsShowPopUp(false);
  };

  return (
    <div className="mt-3 w-full">
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <OfferTable
          onAdd={onAdd}
          onDelete={onComfirm}
          onEdit={onEdit}
          tableData={offers as any}
          variant={session?.user?.role}
          onControl={onControl}
          searchValue={searchText}
          key={searchVal}
        />
      )}

      <Popup show={isShowPopUp} extra="flex flex-col gap-3 py-6 px-8">
        <h1 className="text-3xl">Ürün Silme</h1>
        <p className="mb-2 text-lg">
          Bu Teklifi Silmek istediğini Emin misin ?
        </p>
        <div className="flex gap-4">
          <Button
            loading={isSubmitting}
            text="SİL"
            extra="w-[60px] bg-red-700 h-[40px]"
            onClick={onDelete}
          />
          <Button text="GERİ" extra="w-[60px] h-[40px]" onClick={handleClose} />
        </div>
      </Popup>
    </div>
  );
};

export default Offer;
