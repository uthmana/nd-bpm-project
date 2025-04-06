import React from 'react';
import { formatDateTime, formatNumberLocale } from 'utils';
import nd_logo from '/public/img/auth/nd_logo.webp';
import Barcode from 'react-jsbarcode';
import Image from 'next/image';
import { Invoice } from 'app/localTypes/types';
import { MdDelete } from 'react-icons/md';

interface InvoiceDocProps {
  invoice: Invoice;
  onRemove?: (val: string) => void;
}

export default function InvoiceDoc({ invoice, onRemove }: InvoiceDocProps) {
  return (
    <div className="mx-auto  min-h-[800px] w-full bg-white px-10 py-12 lg:w-[680px] lg:max-w-[680px] print:p-0">
      <div className="mb-8 flex justify-between border-b-2">
        <div className="mb-2 max-w-[200px]">
          <div className="mb-3">
            <Image
              width="90"
              height="60"
              src={`${nd_logo.src}`}
              alt={'nd industries logo'}
            />
          </div>
          <p className="text-sm">
            İkitelli OSB Metal-İş San. Sit. 4. Blok No:1 – No: 3 Başakşehir /
            İstanbul
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="mb-1 text-right text-4xl">İrsaliye</h1>

          <div className="flex h-32 w-[200px] flex-col items-center text-xs font-bold">
            {invoice?.serverSide ? (
              <>
                <img
                  src={`data:image/png;base64, ${invoice.barcode}`}
                  alt="irsaliye barkodu"
                  className="block h-full"
                />
                <span className="block text-center text-xs"> {invoice.id}</span>
              </>
            ) : (
              <Barcode
                className="h-full w-full"
                value={invoice.barcode}
                options={{ format: 'code128' }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mb-12 flex justify-between gap-2">
        <div className="max-w-[360px]">
          <h2 className="mb-3 text-4xl">Sayın:</h2>
          <p className="mb-3 text-sm">{invoice?.customer?.company_name}</p>
          <p className="mb-4 text-sm capitalize">
            {invoice?.customer?.address}
          </p>

          <div className="flex justify-between gap-2 text-sm">
            <div className="pr-1">
              <h2 className="font-bold">Vergi Dairesi</h2>
              <p>{invoice?.customer?.tax_Office} </p>
            </div>
            <div className="w-32">
              <h2 className="font-bold">Vergi No</h2>
              <p>{invoice?.customer?.taxNo}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-5 bg-[#f5f4f4] px-10 py-5 text-sm">
          <div className="flex justify-between gap-3">
            <h2 className="font-bold">Düzenlenme Tarihi</h2>
            <p>{formatDateTime(invoice?.createdAt).split(' ')[0]}</p>
          </div>

          <div className="flex justify-between gap-3">
            <h2 className="font-bold">Fiili Sevk Tarihi</h2>
            <p>{formatDateTime(invoice?.invoiceDate).split(' ')[0]}</p>
          </div>
        </div>
      </div>

      {invoice?.description ? (
        <div className="my-8 px-1 text-sm"> {invoice?.description}</div>
      ) : null}

      <div className="mb-12 w-full">
        <div className="grid w-full grid-cols-10 gap-1 border-b font-bold">
          <div className="col-span-1">#</div>
          <div className="col-span-2">Ürün</div>
          <div className="col-span-3">Uygulama</div>
          <div className="col-span-2">Standart</div>
          <div className="col-span-1">Renk</div>
          <div className="col-span-1">Miktar</div>
        </div>

        {invoice?.Fault?.length > 0 ? (
          <div className="w-full">
            {invoice.Fault.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="group grid w-full grid-cols-10 items-center gap-1 border-b py-2 text-sm font-bold text-navy-700"
                >
                  <div className="relative col-span-1 ">
                    {onRemove &&
                    invoice?.Fault?.length !== 1 &&
                    invoice?.status !== 'PAID' ? (
                      <span
                        className="absolute left-[-4px] top-0 hidden cursor-pointer bg-white group-hover:block"
                        onClick={() => onRemove(item?.id)}
                      >
                        <MdDelete className="h-5 w-5 text-red-400" />
                      </span>
                    ) : null}

                    {idx + 1}
                  </div>
                  <div className="col-span-2">{item?.product}</div>
                  <div className="col-span-3">{item?.application}</div>
                  <div className="col-span-2">{item?.standard}</div>
                  <div className="col-span-1">{item?.color}</div>
                  <div className="col-span-1">
                    {formatNumberLocale(item?.shipmentQty || item?.quantity)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="ml-auto flex max-w-[300px] flex-col text-sm">
        <div className="flex justify-between bg-[#f5f4f4] p-3">
          <h2 className="font-bold"> Tel:</h2>
          <p>0212 549 05 45</p>
        </div>
        <div className="flex justify-between p-3">
          <h2 className="font-bold">Fax:</h2>
          <p>0212 549 05 90</p>
        </div>
        <div className="flex justify-between bg-[#f5f4f4] p-3">
          <h2 className="font-bold">Whatsapp:</h2>
          <p>0542 696 37 69</p>
        </div>
        <div className="flex justify-between p-3">
          <h2 className="font-bold">E-Posta</h2>
          <p>info@ndindustries.com.tr</p>
        </div>
      </div>
    </div>
  );
}
