'use client';

import InvoiceTable from 'components/admin/data-tables/invoiceTable';
import { useRouter, useSearchParams } from 'next/navigation';
import { log } from 'utils';
import { useEffect, useState } from 'react';
import { deleteInvoice, getInvoice } from 'app/lib/apiRequest';
import { TableSkeleton } from 'components/skeleton';
import { toast } from 'react-toastify';
import Popup from 'components/popup';
import Button from 'components/button/button';
import { useSession } from 'next-auth/react';

const Invoice = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [faultId, setFaultId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const searchVal = searchParams.get('q');
  const [searchText, setSearchText] = useState(searchVal || '');

  const getAllInvoice = async () => {
    setIsLoading(true);
    const { status, data } = await getInvoice();
    if (status === 200) {
      const newData = data?.map((item) => {
        const customerName = item?.customer?.company_name;
        const products = item?.process
          ?.map((item, idx) => {
            return `${item.product}`;
          })
          ?.join('');

        item.products = products;
        item.customerName = customerName;
        item.address = item?.customer?.address;
        item.tolalQty = item?.process.reduce((a, b) => a + b.shipmentQty, 0);

        return item;
      });

      setInvoices(newData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllInvoice();
  }, []);

  useEffect(() => {
    setSearchText(searchVal || '');
  }, [searchVal]);

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
    const resInvoice: any = await deleteInvoice(faultId);

    const { status, response } = resInvoice;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('İrsalye silme işlemi başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      toast.success('İrsalye silme işlemi başarılı.');
      setIsSubmitting(false);
      setIsShowPopUp(false);
      setInvoices([]);
      getAllInvoice();
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
        <InvoiceTable
          onAdd={onAdd}
          onDelete={onComfirm}
          onEdit={onEdit}
          tableData={invoices as any}
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

export default Invoice;
