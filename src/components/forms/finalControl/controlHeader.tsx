import React from 'react';
import Image from 'next/image';
import logo from '/public/img/auth/nd.png';
import { formatDateTime } from 'utils';

function HeaderItem(props: {
  tilteEn?: string;
  titleTr?: string;
  value?: string;
  className?: string;
}) {
  const { tilteEn, titleTr, value, className } = props;

  return (
    <div className="mb-1 flex items-center gap-1 text-sm font-medium">
      <div className="flex w-[110px] flex-col">
        <span>{titleTr} :</span>
        <span className="text-xs font-normal italic">{tilteEn} :</span>
      </div>
      <span className={`max-w-[160px] ${className}`}>{value}</span>
    </div>
  );
}

export default function ControlHeader({ data }) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center border-b border-[#000]">
        <Image
          width="80"
          height="20"
          src={logo}
          alt="nd Industries Logo"
          className="mr-[18%]"
        />
        <div>
          <h1 className="mb-0 text-2xl font-bold leading-5">
            Final / Çıkış Kontrol Formu
          </h1>
          <p className="text-lg italic"> Final / Output Inspection Record </p>
        </div>
      </div>

      <div className="mb-3 flex justify-between gap-3">
        <div className="flex w-1/2 flex-col gap-1">
          <HeaderItem
            tilteEn={'Customer '}
            titleTr={'Müşteri'}
            value={data?.customerName?.toLocaleLowerCase()}
            className="max-w-[160px] capitalize"
          />

          <HeaderItem
            tilteEn={'Product'}
            titleTr={'Ürün Adi'}
            value={data?.product}
          />

          <HeaderItem
            tilteEn={'Quantity'}
            titleTr={'Miktar'}
            value={data?.quantity}
          />

          <HeaderItem
            tilteEn={'Proses Tarihi'}
            titleTr={'Process Date'}
            value={formatDateTime(data?.createdAt)}
          />
        </div>
        <div className="flex w-1/2 flex-col">
          <HeaderItem
            tilteEn={'Barcode No'}
            titleTr={'Barkod No'}
            value={data?.product_barcode}
          />

          <HeaderItem
            tilteEn={'Product Code'}
            titleTr={'Ürün Kodu'}
            value={data?.productCode}
          />

          <HeaderItem
            tilteEn={'Date'}
            titleTr={'Tarih'}
            value={data?.createdAt}
          />
        </div>
      </div>
      <div className="mb-3 flex justify-between gap-3 border-b border-t border-[#ccc]">
        <div className="flex w-1/2 flex-col gap-1">
          <HeaderItem
            tilteEn={'Application'}
            titleTr={'Uygulama'}
            value={data?.application}
          />
        </div>
        <div className="flex w-1/2 flex-col">
          <HeaderItem tilteEn={'Color'} titleTr={'Renk'} value={data?.color} />
        </div>
      </div>
    </div>
  );
}
