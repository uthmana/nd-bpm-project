import React, { useState } from 'react';
import { formatDateTime } from 'utils';
import nd_logo from '/public/img/auth/nd_logo.webp';
import Barcode from 'react-jsbarcode';

export default function OfferDoc({ offer }) {
  return (
    <div className="min-h-[800px] w-full bg-white px-10  py-8 lg:w-[680px] lg:max-w-[680px] print:absolute  print:top-0 print:z-[99999] print:min-h-screen print:w-screen">
      <div className="mb-4 flex items-center justify-between border-b-2 pb-2">
        <div className="flex max-w-[200px] flex-col gap-2 text-xs">
          <div className="mb-3">
            <img width={90} src={nd_logo.src} alt="nd industries logo" />
          </div>
          <p>
            İkitelli OSB Metal-İş San. Sit. 4. Blok No:1 – No: 3 Başakşehir /
            İstanbul
          </p>
          <div className="">
            <p>
              <b>Tel: </b>0212 549 05 45
            </p>
            <p>
              <b> Whatsapp:</b> 0542 696 37 69
            </p>
            <p>
              <b>E-Posta:</b> info@ndindustries.com.tr
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="mb-1 text-right text-4xl">Fiyat Teklifi</h1>
          <div className="flex flex-col items-center text-xs font-bold">
            <div className="flex flex-col justify-between gap-3 py-3 text-sm">
              <div className="flex justify-between gap-3">
                <h2 className="font-bold">Başlangıç Tarihi</h2>
                <p className="font-normal">
                  {offer?.startDate
                    ? formatDateTime(offer?.startDate).split(' ')[0]
                    : 'DD-MM-YYYY'}
                </p>
              </div>

              <div className="flex justify-between gap-3">
                <h2 className="font-bold">Bitiş Tarihi</h2>
                <p className="font-normal">
                  {offer?.endDate
                    ? formatDateTime(offer?.endDate).split(' ')[0]
                    : 'DD-MM-YYYY'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-lg font-bold">Müşteri Bilgileri</h2>
        <div className="flex flex-col gap-3 px-4 text-sm">
          <p>{offer?.rep_name}</p>
          <p>{offer?.company_name}</p>
          <p>{offer?.address}</p>
          <p>{offer?.phoneNumber}</p>
          <p>{offer?.email}</p>
        </div>
      </div>

      {offer?.description ? (
        <div className="my-3 px-1 text-sm"> {offer?.description}</div>
      ) : null}

      <p className="mb-5 text-center text-sm italic">
        Aşağıdaki fiyatlandırma KDV ve Nakliye dahil değildir.
      </p>

      <div className="mb-12 w-full" key={offer?.product?.length}>
        <div className="grid w-full grid-cols-6 gap-1 border-b font-bold">
          <div>No</div>
          <div>Ürün</div>
          <div>Uygulama</div>
          <div>Standart</div>
          <div>Miktar</div>
          <div>{`Fiyat (${offer.currency})`}</div>
        </div>

        {offer?.product?.length > 0 ? (
          <>
            {offer.product.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="grid w-full grid-cols-6 items-center gap-1 border-b py-2 text-sm font-bold text-navy-700 dark:text-white"
                >
                  <div>{idx + 1}</div>
                  <div>{item?.name}</div>
                  <div>{item?.application}</div>
                  <div>{item?.standard}</div>
                  <div>{item?.quantity}</div>
                  <div>{item?.price}</div>
                </div>
              );
            })}
          </>
        ) : null}
      </div>

      <div className="ml-auto flex max-w-[220px] flex-col text-sm">
        <div className="flex justify-between bg-[#cccccc] p-2 text-base">
          <h2 className="font-bold">Toplam:</h2>
          <p>
            {offer.totalAmount} {offer.currency}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col justify-between gap-3 py-3 text-sm">
        <h2 className="text-lg font-bold"> Teklifi Hazırlayan:</h2>
        <p>{offer.createdBy}</p>
        <p>{offer.creatorTitle}</p>
        <div className="max-w-[200px]">
          {offer?.serverSide ? (
            <>
              <img
                src={`data:image/png;base64, ${offer?.barcode}`}
                alt="irsaliye barkodu"
                className="block h-full"
              />
              <span className="block text-center text-xs"> {offer.id}</span>
            </>
          ) : (
            <Barcode
              className="h-full w-full"
              value={offer?.barcode || 'ND_INDUSTRIES_TR'}
              options={{ format: 'code128' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
