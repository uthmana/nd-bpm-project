'use client';

import MainTable from 'components/admin/data-tables/mainTable';
import { log } from 'utils';
import { useEffect, useState } from 'react';
import { deleteStock, getStocks } from 'app/lib/apiRequest';
import { TableSkeleton } from 'components/skeleton';
import { toast } from 'react-toastify';
import Popup from 'components/popup';
import Button from 'components/button';
import { stockSync } from 'app/lib/logoRequest';
import { getResError } from 'utils/responseError';

const Stock = () => {
  const [stocks, setStocks] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [stockId, setStockId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  const getAllStocks = async () => {
    try {
      setIsLoading(true);
      const { data } = await getStocks();
      setStocks(
        data?.map((item) => {
          return { ...item, customerName: item?.customer?.company_name };
        }),
      );
      setIsLoading(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllStocks();
  }, []);

  const onComfirm = async (val) => {
    setStockId(val);
    setIsShowPopUp(true);
  };

  const onDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteStock(stockId);

      setStocks([]);
      getAllStocks();
      setIsSubmitting(false);
      setIsShowPopUp(false);

      toast.success('Ürün silme işlemi başarılı.');
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
      const data = await stockSync();
      console.log(data);
      getAllStocks();
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
          addLink={'/admin/stock/create'}
          onDelete={onComfirm}
          tableData={stocks}
          variant="stock"
          onSync={onSync}
          syncLoading={syncLoading}
        />
      )}

      <Popup show={isShowPopUp} extra="flex flex-col gap-3 py-6 px-8">
        <h1 className="text-3xl">Kullanıcı Silme</h1>
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

export default Stock;
