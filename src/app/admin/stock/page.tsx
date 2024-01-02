'use client';

import MainTable from 'components/admin/data-tables/mainTable';
import { stockTableData } from 'variables/data-tables/tableDataMain';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { useEffect, useState } from 'react';
import { deleteStock, getStocks } from 'app/lib/apiRequest';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import { toast } from 'react-toastify';
import Popup from 'components/popup';
import Button from 'components/button/button';

const Stock = () => {
  const router = useRouter();

  const [stocks, setStocks] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [stockId, setStockId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getAllStocks = async () => {
    setIsLoading(true);
    const { status, data } = await getStocks();

    console.log('stocks', data);
    if (status === 200) {
      setStocks(data);
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
    router.push(`/admin/stock/${val}`);
  };

  const onComfirm = async (val) => {
    setStockId(val);
    setIsShowPopUp(true);
  };

  const onDelete = async () => {
    setIsSubmitting(true);
    const { status, data } = await deleteStock(stockId);
    if (status === 200) {
      toast.success('Ürün silme işlemi başarılı.');
      setIsSubmitting(false);
      setIsShowPopUp(false);
      setStocks([]);
      getAllStocks();
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
        <MainTable
          onAdd={onAdd}
          onDelete={onComfirm}
          onEdit={onEdit}
          tableData={stocks}
          variant="stock"
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
