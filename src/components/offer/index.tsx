import Image from 'next/image';
import React from 'react';
import { formatDateTime, currencySymbol } from 'utils';
import nd_logo from '/public/img/auth/nd_logo.webp';

export default function OfferDoc({ offer }) {
  return (
    <div className="page-break min-h-[800px] w-full bg-white px-10  py-8 lg:w-[700px] lg:max-w-[700px] print:absolute  print:top-0 print:z-[99999] print:min-h-screen print:w-full print:pl-0 print:pr-8">
      <div className="mb-4 flex items-center justify-between border-b-2 pb-2">
        <div className="flex max-w-[200px] flex-col gap-2 text-xs">
          <div className="mb-3">
            <Image
              width="90"
              height="60"
              src={`${nd_logo.src}`}
              alt={'nd industries logo'}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 ">
          <div className="flex flex-col items-start text-xs">
            <p>ND Industries Türkiye</p>
            <p>
              İkitelli OSB Metal-İş San. Sit. 4. <br />
              Blok No:1 – No: 3 Başakşehir / İstanbul
            </p>
            <p>+90 (212) 549-0545</p>
            <p>www.ndindustries.com.tr</p>
          </div>
        </div>
      </div>

      <h1 className="my-6 text-center text-lg font-medium">TEKLİF</h1>

      <div className="mb-8 flex w-full justify-between">
        <div className="flex flex-col gap-1  text-sm">
          <div className="flex  gap-4 capitalize">
            <span className="w-12  text-xs font-bold">Müşteri</span>
            <span className="max-w-[250px]">
              {offer?.company_name?.toLowerCase() ||
                offer?.companyName?.toLowerCase() ||
                offer?.Customer?.company_name?.toLowerCase()}
            </span>
          </div>
          <div className="flex  gap-4 capitalize">
            <span className="w-12 text-xs font-bold">İlgili</span>
            <span> {offer?.rep_name}</span>
          </div>
          <div className="flex  gap-4">
            <span className="w-12 text-xs font-bold">E-posta</span>
            <span>{offer?.email}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <div className="flex  justify-between gap-1">
            <span className="mr-1 whitespace-nowrap text-xs font-bold">
              Referans No:
            </span>
            <span className="text-right">{offer?.barcode}</span>
          </div>

          <div className="flex  justify-between gap-1">
            <span className="mr-1 whitespace-nowrap text-xs font-bold">
              Teklif Tarihi:
            </span>
            <span className="text-right">
              {offer?.startDate
                ? formatDateTime(offer?.startDate).split(' ')[0]
                : 'DD-MM-YYYY'}
            </span>
          </div>

          <div className="flex  justify-between gap-1">
            <span className=" mr-1 whitespace-nowrap text-xs font-bold">
              Son Geçerlilik:
            </span>
            <span className="text-right">
              {offer?.endDate
                ? formatDateTime(offer?.endDate).split(' ')[0]
                : 'DD-MM-YYYY'}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-8 grid w-full grid-cols-2">
        <div className="flex flex-col gap-1  text-sm">
          <h2 className="text-xs font-bold">Adres:</h2>
          <p className="flex items-center gap-4 capitalize">
            {offer?.address?.toLowerCase()}
          </p>
        </div>

        {/* <div className="flex flex-col gap-1 text-sm">
          <h2 className="text-xs font-bold">Sevkiyat Adresi:</h2>
          <p className="flex items-center gap-4 capitalize">
            {offer?.address?.toLowerCase()}
          </p>
        </div> */}
      </div>

      <div className="w-full" key={offer?.product?.length}>
        <div className="grid w-full grid-cols-10 gap-1 border-b text-xs font-bold">
          <div className="col-span-2">Ürün</div>
          <div className="col-span-2">Uygulama</div>
          <div className="col-span-2">Standart</div>
          <div className="col-span-1">Miktar</div>
          <div className="col-span-1">Birim Fiyat</div>
          <div className="col-span-2">Tutar</div>
        </div>

        {offer?.product?.length > 0 ? (
          <>
            {offer.product.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="grid w-full grid-cols-10 items-start gap-1 border-b py-2 text-xs font-bold"
                >
                  <div className="col-span-2 grid grid-cols-5">
                    {item?.image ? (
                      <span className="col-span-1">
                        <Image
                          width={40}
                          height={60}
                          src={`${item?.image}`}
                          alt={'product'}
                          className="w-full"
                        />
                      </span>
                    ) : null}

                    <div className="col-span-2 px-1">
                      <div>{item?.name}</div>
                      <div className="text-xs font-normal">
                        {item?.description}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">{item?.application}</div>
                  <div className="col-span-2">{item?.standard}</div>
                  <div className="col-span-1">{item?.quantity}</div>
                  <div className="col-span-1 flex gap-1">
                    <span>{item?.unitPrice}</span>
                    <span> {currencySymbol[offer?.currency]}</span>
                  </div>
                  <div className="col-span-2">
                    {item?.price}
                    {currencySymbol[offer?.currency]}
                  </div>
                </div>
              );
            })}
          </>
        ) : null}
      </div>

      <div className="mb-5 mt-3 flex w-full justify-end py-2 text-sm">
        <div className="flex  pr-3 text-right font-bold">
          Toplam:
          <span className="ml-1 inline-block min-w-24">
            {offer.totalAmount} {currencySymbol[offer?.currency]}
          </span>
        </div>
      </div>

      {offer?.description ? (
        <div className="mb-8 text-sm"> {offer?.description}</div>
      ) : null}

      <div className="mb-8 grid grid-cols-2 justify-between py-2 text-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="w-16 text-xs font-bold">Hazırlayan:</span>
            <span></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-xs font-bold">İmza:</span>
            <span className="max-w-[60px]">
              {offer?.creatorTitle ? (
                <Image
                  className="w-full"
                  src={offer?.creatorTitle}
                  alt={'İmza'}
                  width={10}
                  height={10}
                />
              ) : null}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-xs font-bold">İsim:</span>
            <span>{offer.createdBy}</span>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="w-18  text-xs font-bold">Kabul Eden:</span>
            <span></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-18  text-xs font-bold">İmza:</span>
            <span></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-18  text-xs font-bold">İsim:</span>
            <span></span>
          </div>
        </div>
      </div>
      <p className="mb-5 text-center text-sm italic">
        Yükarıdaki fiyatlandırma KDV ve Nakliye dahil değildir.
      </p>
    </div>
  );
}
