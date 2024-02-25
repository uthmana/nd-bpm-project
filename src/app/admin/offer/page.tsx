'use client';
import OfferDoc from 'components/offer';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import InvoiceTable from 'components/admin/data-tables/invoiceTable';
import { useRouter, useSearchParams } from 'next/navigation';
import { log } from 'utils';
import { useEffect, useState } from 'react';
import { deleteOffer, getOffer } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import Popup from 'components/popup';
import Button from 'components/button/button';
import { useSession } from 'next-auth/react';

const Offer = () => {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [faultId, setFaultId] = useState('');
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
      setOffers(data);
    }
    setIsLoading(false);
  };

  const onAdd = () => {
    router.push('/admin/invoice/create');
  };

  const onEdit = (val) => {
    router.push(`/admin/invoice/create/${val}`);
  };

  const onControl = (val) => {
    router.push(`/admin/invoice/${val}`);
  };

  const onComfirm = async (val) => {
    setFaultId(val);
    setIsShowPopUp(true);
  };

  const onDelete = async () => {
    setIsSubmitting(true);
    const resInvoice: any = await deleteOffer(faultId);

    const { status, response } = resInvoice;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Ürün silmeişlemi başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      toast.success('Ürün silme işlemi başarılı.');
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

  useEffect(() => {
    getAllOffer();
  }, []);

  return (
    <div className="mt-3 w-full">
      {isLoading ? (
        <LatestInvoicesSkeleton />
      ) : (
        <InvoiceTable
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
          Bu İrsaliye'yi Silmek istediğini Emin misin ?
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
