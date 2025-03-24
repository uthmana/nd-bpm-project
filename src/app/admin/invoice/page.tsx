'use client';

import InvoiceTable from 'components/admin/data-tables/invoiceTable';
import { useRouter, useSearchParams } from 'next/navigation';
import { log } from 'utils';
import { useEffect, useState } from 'react';
import {
  deleteInvoice,
  getCustomersWithFilter,
  getInvoice,
} from 'app/lib/apiRequest';
import { TableSkeleton } from 'components/skeleton';
import { toast } from 'react-toastify';
import Popup from 'components/popup';
import Button from 'components/button';
import { useSession } from 'next-auth/react';
import Accordion from 'components/accordion';
import Card from 'components/card';

const Invoice = () => {
  const router = useRouter();

  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [faultId, setFaultId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const searchVal = searchParams.get('q');
  const [searchText, setSearchText] = useState(searchVal || '');

  const [newInvoices, setNewInvoices] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const getAllInvoice = async () => {
    setIsLoading(true);
    const [newInvoiceRes, invoiceRes] = await Promise.all([
      getCustomersWithFilter({
        where: {
          Fault: {
            some: { status: 'IRSALIYE_KESIMI_BEKLENIYOR' },
          },
        },
        include: {
          Fault: {
            where: { status: 'IRSALIYE_KESIMI_BEKLENIYOR' },
          },
        },
      }),
      getInvoice(),
    ]);

    setNewInvoices(newInvoiceRes.data);
    setInvoices(
      invoiceRes?.data?.map((item) => {
        return {
          ...item,
          customerName: item?.customer?.company_name,
          products: item?.Fault?.length,
          address: item?.customer?.address,
        };
      }),
    );

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
    router.push(`/admin/invoice/${val}`);
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

  const onSendNewInvoice = (val: any) => {
    router.push(`/admin/invoice/${val.id}?newinvoice=true`);
  };

  return (
    <div className="mt-3 w-full">
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <>
          {newInvoices?.length > 0 ? (
            <Card extra="mx-auto w-full mb-16 rounded-2xl bg-white p-8 dark:bg-[#111c44] dark:text-white">
              <h2 className="mb-4 text-2xl font-bold">Bekleyen İrsaliye</h2>

              {newInvoices?.map((item, idx) => (
                <Accordion key={idx} title={item?.company_name} index={idx}>
                  <div className="mb-4">
                    <div className="grid w-full grid-cols-6 gap-1 border-b font-bold dark:border-gray-900">
                      <div>#</div>
                      <div>Ürün</div>
                      <div>Uygulama</div>
                      <div>Standart</div>
                      <div>Renk</div>
                      <div>Miktar</div>
                    </div>

                    {item.Fault?.map((faultItem, idx) => (
                      <div
                        key={faultItem.id}
                        className="grid w-full grid-cols-1"
                      >
                        <label className="flex items-center" key={faultItem.id}>
                          <div className="grid w-full grid-cols-6 items-center gap-1 border-b py-2 text-sm font-bold text-navy-700 dark:border-gray-900 dark:text-white">
                            <div>{idx + 1}</div>
                            <div>{faultItem?.product}</div>
                            <div>{faultItem?.application}</div>
                            <div>{faultItem?.standard}</div>
                            <div>{faultItem?.color}</div>
                            <div>
                              {faultItem?.shipmentQty || faultItem?.quantity}
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => onSendNewInvoice(item)}
                    extra="mt-4 max-w-fit px-4 h-[40px] mb-4"
                    text="İRSALİYE TAMAMLA"
                  />
                </Accordion>
              ))}
            </Card>
          ) : null}
          <div className="p-4">
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
          </div>
        </>
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
