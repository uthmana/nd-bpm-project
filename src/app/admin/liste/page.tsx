'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { log } from 'utils';
import { useEffect, useState } from 'react';
import { deleteFault, getFaults } from 'app/lib/apiRequest';
import { TableSkeleton } from 'components/skeleton';
import { toast } from 'react-toastify';
import Popup from 'components/popup';
import Button from 'components/button/button';
import { useSession } from 'next-auth/react';
import ListeTable from 'components/admin/data-tables/listeTable';

const Liste = () => {
  const router = useRouter();
  const [faults, setFaults] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [faultId, setFaultId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const searchVal = searchParams.get('q');
  const [searchText, setSearchText] = useState(searchVal || '');

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

  useEffect(() => {
    setSearchText(searchVal || '');
  }, [searchVal]);

  const onAdd = () => {
    router.push('/admin/entry/create');
  };

  const onEdit = (val) => {
    router.push(`/admin/entry/create/${val}`);
  };

  const onControl = (val) => {
    router.push(`/admin/entry/${val}`);
  };
  const onHistory = (val) => {
    router.push(`/admin/liste/${val}`);
  };

  const onComfirm = async (val) => {
    setFaultId(val);
    setIsShowPopUp(true);
  };

  const onDelete = async () => {
    setIsSubmitting(true);
    const resFault: any = await deleteFault(faultId);

    const { status, response } = resFault;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Ürün silme işlemi başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      toast.success('Ürün silme işlemi başarılı.');
      setIsSubmitting(false);
      setIsShowPopUp(false);
      setFaults([]);
      getAllFaults();
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
        <ListeTable
          onAdd={onAdd}
          onDelete={onComfirm}
          onEdit={onEdit}
          tableData={faults as any}
          variant={session?.user?.role}
          onControl={onControl}
          searchValue={searchText}
          onHistory={onHistory}
          key={searchVal}
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

export default Liste;
