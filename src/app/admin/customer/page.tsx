'use client';

import MainTable from 'components/admin/data-tables/mainTable';
import { useEffect, useState } from 'react';
import { deleteCustomer, getCustomers } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import Popup from 'components/popup';
import Button from 'components/button';
import { TableSkeleton } from 'components/skeleton';
import { customerSync } from 'app/lib/logoRequest';
import { log } from 'utils';
import { getResError } from 'utils/responseError';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  const getAllCustomers = async () => {
    setIsloading(true);
    try {
      const { data } = await getCustomers();
      setCustomers(data);
      setIsloading(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsloading(false);
    }
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
    try {
      await deleteCustomer(customerId);
      toast.success('Kullanıcı silme işlemi başarılı.');
      setIsSubmitting(false);
      setIsShowPopUp(false);
      setCustomers([]);
      getAllCustomers();
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsSubmitting(false);
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
      const message = getResError(error?.message);
      toast.error(`${message}`);
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
