import React from 'react';
import { formatDateTime } from 'utils';
import nd_logo from '/public/img/auth/nd_logo.webp';

export default function InvoiceDoc({ invoice }) {
  return (
    <div className="min-h-[800px] w-[700px] max-w-[700px] bg-white px-10 py-12 print:fixed print:top-0 print:z-[99999] print:h-screen print:w-screen">
      <div className="mb-8 flex justify-between border-b-2">
        <div className="mb-2 max-w-[200px]">
          <div className="mb-3">
            <img width={90} src={nd_logo.src} alt="nd industries logo" />
          </div>
          <p className="text-sm">
            İkitelli OSB Metal-İş San. Sit. 4. Blok No:1 – No: 3 Başakşehir /
            İstanbul
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="mb-1 text-4xl">İrsaliye</h1>
          <p className="font-bold">Banka Hesap No:</p>
          <p className="text-sm">Şube Adı:</p>
          <div className="text-xs font-bold">
            <span>34334</span> <span> TR-87384859696745</span>
          </div>
        </div>
      </div>

      <div className="mb-12 flex justify-between gap-2">
        <div className="max-w-[360px]">
          <h2 className="mb-3 text-4xl">Sayın:</h2>
          <p className="mb-3 text-sm">{invoice?.rep_name}</p>
          <p className="mb-4 text-sm capitalize">{invoice?.address}</p>

          <div className="flex justify-between gap-2 text-sm">
            <div className="pr-1">
              <h2 className="font-bold">Vergi Dairesi</h2>
              <p>{invoice?.tax_Office} </p>
            </div>
            <div className="w-32">
              <h2 className="font-bold">Vergi No</h2>
              <p>{invoice?.taxNo}</p>
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

      <div className="mb-12 w-full">
        <div className="grid w-full grid-cols-4 gap-1 border-b font-bold">
          <div className="w-12">No</div>
          <div>Ürün</div>
          <div>Miktar</div>
          <div>Tutar {invoice?.currency}</div>
        </div>

        {invoice?.process?.length > 0 ? (
          <>
            {invoice.process.map((item, idx) => {
              return (
                <div
                  key={item.id}
                  className="grid w-full grid-cols-4 gap-1 border-b py-2"
                >
                  <div className="w-12">{idx + 1}</div>
                  <div>{item.product}</div>
                  <div>{item.quantity}</div>
                  <div>
                    {invoice?.amount || 0} {invoice?.currency}
                  </div>
                </div>
              );
            })}
          </>
        ) : null}
      </div>

      <div className="text-md ml-auto flex max-w-[300px] flex-col">
        <div className="flex justify-between bg-[#f5f4f4] px-3 py-4">
          <h2 className="font-bold">Toplam</h2>
          <p>
            {invoice?.amount || 0} {invoice?.currency}
          </p>
        </div>
        <div className="flex justify-between px-3 py-4">
          <h2 className="font-bold">KDV%</h2>
          <p>{invoice?.vat || 0}</p>
        </div>
        <div className="flex justify-between bg-[#f5f4f4] px-3 py-4">
          <h2 className="font-bold">Genel Toplam</h2>
          <p>
            {invoice?.totalAmount || 0} {invoice?.currency}
          </p>
        </div>
      </div>
    </div>
  );
}
