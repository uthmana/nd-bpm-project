'use client';

import MainTable from 'components/admin/data-tables/mainTable';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { useEffect, useState } from 'react';
import { deleteStock, getProductList, getZeroStocks } from 'app/lib/apiRequest';
import { TableSkeleton } from 'components/skeleton';
import { toast } from 'react-toastify';
import Popup from 'components/popup';
import Button from 'components/button/button';
import { stat } from 'fs';

const Liste = () => {
  const router = useRouter();
  const [stocks, setStocks] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [stockId, setStockId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const getAllLists = async () => {
    setIsLoading(true);
    const { status, data } = await getProductList();
    if (status === 200) {
      console.log({ data });
    } else {
      console.log({ data });
    }
  };

  const getAllStocks = async () => {
    setIsLoading(true);
    const { status, data } = await getZeroStocks();
    if (status === 200) {
      setStocks(
        data?.map((item) => {
          return { ...item, customerName: item?.customer?.company_name };
        }),
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllStocks();
  }, []);

  const onAdd = () => {
    router.push('/admin/stock/create');
  };

  const onEdit = (val) => {
    router.push(`/admin/stock/create/${val}`);
  };

  const onComfirm = async (val) => {
    setStockId(val);
    setIsShowPopUp(true);
  };

  const onDelete = async () => {
    setIsSubmitting(true);
    const resData: any = await deleteStock(stockId);

    const { status, response } = resData;
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
      setStocks([]);
      getAllStocks();
      return;
    }
  };

  const handleClose = (val: string) => {
    setIsShowPopUp(false);
  };

  const handleActivation = () => {
    // setIsShowPopUp(false);
    setIsActive(!isActive);
  };
  return (
    <div className="mt-3 w-full">
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <MainTable
          onAdd={onAdd}
          onDelete={onComfirm}
          onEdit={onEdit}
          tableData={stocks}
          variant="stock"
        />
      )}
      <Button onClick={handleActivation} text="close" />
      <Button onClick={getAllLists} text="getLists" />
      {isActive ? <h1>Iam active</h1> : <h1>Iam not active</h1>}

      <Popup show={isShowPopUp} extra="flex flex-col gap-3 py-6 px-8">
        <h1 className="text-3xl">Kullanıcı Silme</h1>
        <p className="mb-2 text-lg">Bu Ürünü Silmek İstediğiniz Emin Misin ?</p>
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
