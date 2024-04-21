'use client';

import React, { useState } from 'react';
import TextArea from 'components/fields/textArea';
import Button from 'components/button/button';
import Image from 'next/image';
import logo from '/public/img/auth/nd.png';
import Radio from 'components/radio';

type faultInfo = {
  customerName: string;
  product: string;
  quantity: string;
  application: string;
  product_barcode: string;
  productCode: string;
  createdAt: string;
  createdBy: string;
  color: string;
};

type UnacceptInfo = {
  unacceptableStage: string;
  unacceptableDescription: string;
  unacceptableAction: string;
  result: string;
  description: string;
  id: string;
};

type UnacceptObj = {
  fault: faultInfo;
  unacceptable: UnacceptInfo;
};

export default function Unaccept(props: {
  onSaveUnacceptable: (e: any) => void;
  handleClose: (e: any) => void;
  formData?: UnacceptObj;
  isSubmittingUnaccept: boolean;
}) {
  const { formData, onSaveUnacceptable, handleClose, isSubmittingUnaccept } =
    props;
  const { fault, unacceptable } = formData;
  const [values, setValues] = useState(unacceptable as UnacceptInfo);

  const handleValues = (event) => {
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  const handleSubmit = () => {
    //TODO: validate values
    onSaveUnacceptable(values);
  };

  const unsuitableStages = [
    {
      label: 'Giriş',
      value: 'ENTRY',
    },
    {
      label: 'Proses Kontrol',
      value: 'PROCESS',
    },
    {
      label: 'Final Kontrol',
      value: 'FINAL',
    },
    {
      label: 'Müşteri',
      value: 'CUSTOMER',
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center border-b border-[#000]">
        <Image
          width="70"
          height="20"
          src={logo}
          alt="nd Industries Logo"
          className="mr-[18%]"
        />
        <h1 className="text-lg font-bold">Uygunsuz Ürün/Hizmet Formu</h1>
      </div>

      <div className="mb-3 flex justify-between gap-3">
        <div className="flex w-1/2 flex-col">
          <div className="flex items-center  text-sm font-semibold">
            <span className="w-[100px] font-normal">Müşteri :</span>
            <span className="text-xs capitalize">
              {fault?.customerName?.toLocaleLowerCase()}
            </span>
          </div>
          <div className="flex items-center text-sm font-semibold">
            <span className="w-[80px] font-normal">Ürün Adi :</span>
            <span className="text-xs">{fault?.product}</span>
          </div>
          <div className="flex items-center  text-sm font-semibold">
            <span className="w-[80px] font-normal">Miktar :</span>
            <span className="text-xs">{fault?.quantity}</span>
          </div>
          <div className="flex items-center  text-sm font-semibold">
            <span className="w-[80px] font-normal">Uygulama :</span>
            <span className="text-xs">{fault?.application}</span>
          </div>
        </div>

        <div className="flex w-1/2 flex-col">
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span className="w-[80px] font-normal">Barkod No :</span>
            <span className="text-xs">{fault?.product_barcode}</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span className="w-[80px] font-normal">Ürün Kodu :</span>
            <span className="text-xs">{fault?.productCode}</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span className="w-[80px] font-normal">Tarih :</span>
            <span className="text-xs">{fault?.createdAt}</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span className="w-[80px] font-normal">Renk: </span>
            <span className="text-xs">{fault?.color}</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="p-1 text-center text-sm font-bold underline">
          Uygunsuzluk Tespit Aşaması
        </div>

        <div className="mb-4 w-full">
          <div className="grid w-full grid-cols-2 justify-center gap-2">
            {unsuitableStages.map((item, idx) => {
              return (
                <div
                  key={idx + 'qwe'}
                  className="flex items-center gap-3 text-sm font-semibold"
                >
                  <span className="w-[100px] font-normal">{item.label}</span>
                  <Radio
                    name="unacceptableStage"
                    value={item.value}
                    onChange={handleValues}
                    checked={values?.unacceptableStage === item.value}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="border border-[#000] p-1 text-center text-sm font-bold">
          Uygunsuzluğun Tanımı
        </div>
        <TextArea
          onChange={handleValues}
          id="unacceptableDescription"
          name="unacceptableDescription"
          placeholder=""
          extra="mb-3 !rounded-none !border-[#000000] border-t-0"
          value={values?.unacceptableDescription}
          rows={2}
        />
      </div>

      <div className="w-full">
        <div className="border border-[#000] p-1 text-center text-sm font-bold">
          Alınan Aksiyonlar
        </div>
        <TextArea
          onChange={handleValues}
          id="unacceptableAction"
          name="unacceptableAction"
          placeholder=""
          extra="mb-3 !rounded-none !border-[#000000] border-t-0"
          value={values?.unacceptableAction}
          rows={2}
        />
      </div>

      <div className="w-full">
        <div className="border border-[#000] p-1 text-center text-sm font-bold">
          Sonuc/Karar
        </div>
        <TextArea
          onChange={handleValues}
          id="result"
          name="result"
          placeholder=""
          extra="mb-3 !rounded-none !border-[#000000] !border-t-0"
          value={values?.result}
          rows={2}
        />
      </div>

      <div className="mb-5 flex w-full items-center">
        <div className="w-[100px] border border-r-0 border-[#000000] p-3 text-center text-sm font-bold">
          Açıklama:
        </div>
        <div className="w-full">
          <TextArea
            onChange={handleValues}
            id="description"
            name="description"
            placeholder=""
            extra="!rounded-none !border-[#000000]"
            rows={1}
            value={values?.description}
          />
        </div>
      </div>

      <div className="mb-5 flex w-full justify-end">
        <div className="mr-5 flex flex-col gap-2 text-sm">
          <div>Onaylayan / QC</div>
          <div className="font-bold">{fault?.createdBy}</div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          loading={isSubmittingUnaccept}
          text="Kaydet"
          extra="w-[60px] bg-red-700 h-[40px]"
          onClick={handleSubmit}
        />
        <Button text="GERİ" extra="w-[60px] h-[40px]" onClick={handleClose} />
      </div>
    </div>
  );
}
