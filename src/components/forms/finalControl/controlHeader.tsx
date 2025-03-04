import React from 'react';
import Image from 'next/image';
import logo from '/public/img/auth/nd.png';
import { formatDateTime, formatNumberLocale } from 'utils';
import HeaderItem from '../formheaderItem';

export default function ControlHeader({
  data,
  variant = 'entry',
  title,
  titleEn,
}) {
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
          <h1 className="mb-0 text-2xl font-bold leading-5">{title}</h1>
          <p className="text-lg italic"> {titleEn}</p>
        </div>
      </div>

      <div className="mb-3 flex justify-between gap-3">
        <div className="flex w-1/2 flex-col gap-1">
          <HeaderItem
            tilteEn={'Customer '}
            titleTr={'Müşteri'}
            value={
              data?.customerName?.toLocaleLowerCase() ||
              data?.customer?.company_name
            }
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
            value={formatNumberLocale(data?.quantity)}
          />

          <HeaderItem
            titleTr={variant !== 'entry' ? 'Proses Tarihi' : 'Giriş Tarihi'}
            tilteEn={variant !== 'entry' ? 'Process Date' : 'Entry Date'}
            value={formatDateTime(
              data?.process ? data?.process[0]?.updatedAt : data?.createdAt,
            )}
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
            value={formatDateTime(data?.createdAt)}
          />

          {data?.technicalDrawingAttachment ? (
            <HeaderItem
              titleTr={'İlgili Doküman'}
              tilteEn={'Attachment File'}
              value={data?.technicalDrawingAttachment}
              type="file"
            />
          ) : null}
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
