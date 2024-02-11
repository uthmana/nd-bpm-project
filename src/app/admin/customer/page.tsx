'use client';

import MainTable from 'components/admin/data-tables/mainTable';
import { customerTableData } from 'variables/data-tables/tableDataMain';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { useEffect, useState } from 'react';
import { deleteCustomer, getCustomers } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import Popup from 'components/popup';
import Button from 'components/button/button';
import { LatestInvoicesSkeleton } from 'components/skeleton';

const Customers = () => {
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsloading] = useState(false);

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

  const onAdd = () => {
    router.push('/admin/customer/create');
  };

  const onEdit = (val: string) => {
    router.push(`/admin/customer/create/${val}`);
  };

  return (
    <div className="mt-3 w-full">
      {isLoading ? (
        <LatestInvoicesSkeleton />
      ) : (
        <MainTable
          onAdd={onAdd}
          onDelete={onComfirm}
          onEdit={onEdit}
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
