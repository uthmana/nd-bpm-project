'use client';

import EntryTable from 'components/admin/data-tables/entryTable';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { useEffect, useState } from 'react';
import { deleteFault, getFaults } from 'app/lib/apiRequest';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import { toast } from 'react-toastify';
import Popup from 'components/popup';
import Button from 'components/button/button';
import { useSession } from 'next-auth/react';

const Entry = () => {
  const router = useRouter();
  const [faults, setFaults] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [faultId, setFaultId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const getAllFaults = async () => {
    setIsLoading(true);
    const { status, data } = await getFaults();
    if (status === 200) {
      setFaults(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllFaults();
  }, []);

  const onAdd = () => {
    router.push('/admin/entry/create');
  };

  const onEdit = (val) => {
    router.push(`/admin/entry/${val}`);
  };

  const onControl = (val) => {
    router.push(`/admin/entry/control/${val}`);
  };

  const onComfirm = async (val) => {
    setFaultId(val);
    setIsShowPopUp(true);
  };

  const onDelete = async () => {
    setIsSubmitting(true);
    const { status, data } = await deleteFault(faultId);
    if (status === 200) {
      toast.success('Ürün silme işlemi başarılı.');
      setIsSubmitting(false);
      setIsShowPopUp(false);
      setFaults([]);
      getAllFaults();
      return;
    } else {
      toast.error('Bir hata oluştu, tekrar deneyin !');
    }
  };

  const handleClose = (val: string) => {
    setIsShowPopUp(false);
  };

  return (
    <div className="mt-3 w-full">
      {isLoading ? (
        <LatestInvoicesSkeleton />
      ) : (
        <EntryTable
          onAdd={onAdd}
          onDelete={onComfirm}
          onEdit={onEdit}
          tableData={faults as any}
          variant={session?.user?.role}
          onControl={onControl}
        />
      )}

      <Popup show={isShowPopUp} extra="flex flex-col gap-3 py-6 px-8">
        <h1 className="text-3xl">Ürün Silme</h1>
        <p className="mb-2 text-lg">Bu Ürünü Silmek istediğini Emin misin ?</p>
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

export default Entry;
