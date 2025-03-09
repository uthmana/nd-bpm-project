'use client';

import MainTable from 'components/admin/data-tables/mainTable';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { deleteCustomer, getCustomers } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import Popup from 'components/popup';
import Button from 'components/button';
import { TableSkeleton } from 'components/skeleton';
import { customerSync } from 'app/lib/logoRequest';
import { log } from 'utils';

const Customers = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  const getAllCustomers = async () => {
    setIsloading(true);
    const { status, data } = await getCustomers();
    if (status === 200) {
      setCustomers(data);
    }
    setIsloading(false);
  };

  useEffect(() => {
    getAllCustomers();
  }, []);

  const onComfirm = async (val) => {
    setCustomerId(val);
    setIsShowPopUp(true);
  };

  const onDelete = async () => {
    setIsSubmitting(true);
    const { status, data } = await deleteCustomer(customerId);
    if (status === 200) {
      toast.success('Kullanıcı silme işlemi başarılı.');
      setIsSubmitting(false);
      setIsShowPopUp(false);
      setCustomers([]);
      getAllCustomers();
      return;
    } else {
      toast.error('Bir hata oluştu, tekrar deneyin !');
    }
  };

  const handleClose = (val: string) => {
    setIsShowPopUp(false);
  };

  const onSync = async (val: string) => {
    if (!val) return;
    setSyncLoading(true);
    try {
      const data = await customerSync();
      log(data);
      getAllCustomers();
      setSyncLoading(false);
    } catch (error) {
      log(error);
      setSyncLoading(false);
    }
  };

  return (
    <div className="mt-3 w-full">
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <MainTable
          addLink={'/admin/customer/create'}
          onDelete={onComfirm}
          onSync={onSync}
          syncLoading={syncLoading}
          tableData={customers}
          variant="customer"
        />
      )}

      <Popup show={isShowPopUp} extra="flex flex-col gap-3 py-6 px-8">
        <h1 className="text-3xl">Kullanıcı Silme</h1>
        <p className="mb-2 text-lg">
          Bu Kullanıcıyı Silmek istediğini Emin misin ?
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

export default Customers;
