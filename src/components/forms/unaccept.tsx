'use client';

import React, { useState } from 'react';
import TextArea from 'components/fields/textArea';
import Button from 'components/button';
import Image from 'next/image';
import logo from '/public/img/auth/nd.png';
import Radio from 'components/radio';
import { toast } from 'react-toastify';
import { MdCheck } from 'react-icons/md';
import FormHeaderItem from './formheaderItem';
import { Fault } from 'app/localTypes/types';
import ControlHeader from './finalControl/controlHeader';

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
  customer: any;
};

type UnacceptInfo = {
  unacceptableStage: string;
  unacceptableDescription: string;
  unacceptableAction: string;
  result: string;
  description: string;
  createdBy: string;
  id: string;
};

type UnacceptObj = {
  fault: Fault;
  unacceptable: UnacceptInfo;
};

export default function Unaccept(props: {
  onSaveUnacceptable?: (e: any) => void;
  handleClose?: (e: any) => void;
  formData?: UnacceptInfo;
  fault: Fault;
  isSubmittingUnaccept?: boolean;
  variant?: string;
}) {
  const {
    formData,
    fault,
    variant = 'input',
    onSaveUnacceptable,
    handleClose,
    isSubmittingUnaccept,
  } = props;
  // const { fault, unacceptable } = formData;
  const isUpdate = formData?.id != undefined;
  const [values, setValues] = useState(
    isUpdate
      ? formData
      : ({
          unacceptableStage: 'ENTRY',
          unacceptableDescription: '',
          unacceptableAction: '',
          result: '',
          description: '',
          createdBy: '',
          ...formData,
        } as UnacceptInfo),
  );

  const handleValues = (event) => {
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  const handleSubmit = () => {
    if (!values?.unacceptableStage) {
      toast.error('Lütfen Uygunsuz Ürün/Hizmet Formu doldurmanız gerekiyor !');
      return;
    }
    onSaveUnacceptable(values);
  };

  const unsuitableStages = [
    {
      label: 'Giriş',
      value: 'ENTRY',
    },
    {
      label: 'Final Kontrol',
      value: 'FINAL',
    },
    // {
    //   label: 'Proses Kontrol',
    //   value: 'PROCESS',
    // },
    // {
    //   label: 'Müşteri',
    //   value: 'CUSTOMER',
    // },
  ];

  return (
    <div className="w-full dark:bg-[#111c44] dark:text-white ">
      <div className="mb-2 flex items-center  dark:border-gray-900">
        <ControlHeader
          data={fault}
          variant="entry"
          title="Uygunsuz Ürün/Hizmet Formu"
          titleEn="Inappropriate Product/Service Form"
        />
      </div>

      <div className="w-full pb-3">
        <div className="p-1 text-center text-sm font-bold underline">
          Uygunsuzluk Tespit Aşaması
        </div>

        <div className="my-5 w-full">
          <div className="flex w-full flex-wrap justify-center gap-7">
            {unsuitableStages.map((item, idx) => {
              return (
                <div
                  key={idx + 'qwe'}
                  className="flex flex-1 justify-center gap-3 text-sm font-semibold"
                >
                  <span className="font-normal">{item.label}</span>
                  {variant && variant === 'value' ? (
                    <div className="border border-[#000] px-3 py-1 dark:border-gray-900">
                      {values?.unacceptableStage === item.value ? (
                        <MdCheck className="h-4 w-4" />
                      ) : (
                        <div className="h-4 w-4"></div>
                      )}
                    </div>
                  ) : (
                    <Radio
                      name="unacceptableStage"
                      value={item.value}
                      disabled={variant === 'value'}
                      onChange={handleValues}
                      checked={values?.unacceptableStage === item.value}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="border border-[#000] p-1 text-center text-sm font-bold dark:border-gray-900">
          Uygunsuzluğun Tanımı
        </div>
        {variant && variant === 'value' ? (
          <div className="mb-3 min-h-16 border border-t-0 border-[#000000] px-2 py-1 text-sm dark:border-gray-900">
            {values?.unacceptableDescription}
          </div>
        ) : (
          <TextArea
            onChange={handleValues}
            id="unacceptableDescription"
            name="unacceptableDescription"
            placeholder=""
            extra="mb-3 !rounded-none !border-[#000000] dark:border-gray-900 border-t-0"
            value={values?.unacceptableDescription}
            rows={2}
          />
        )}
      </div>

      <div className="w-full">
        <div className="border border-[#000] p-1 text-center text-sm font-bold dark:border-gray-900">
          Alınan Aksiyonlar
        </div>
        {variant && variant === 'value' ? (
          <div className="mb-3  min-h-16 border border-t-0 border-[#000000] px-2 py-1 text-sm dark:border-gray-900">
            {values?.unacceptableAction}
          </div>
        ) : (
          <TextArea
            onChange={handleValues}
            id="unacceptableAction"
            name="unacceptableAction"
            placeholder=""
            extra="mb-3 !rounded-none !border-[#000000] dark:border-gray-900 border-t-0"
            value={values?.unacceptableAction}
            rows={2}
          />
        )}
      </div>

      <div className="w-full">
        <div className="border border-[#000] p-1 text-center text-sm font-bold dark:border-gray-900">
          Sonuc/Karar
        </div>
        {variant && variant === 'value' ? (
          <div className="mb-3  min-h-16 border border-t-0 border-[#000000] px-2 py-1 text-sm dark:border-gray-900">
            {values?.result}
          </div>
        ) : (
          <TextArea
            onChange={handleValues}
            id="result"
            name="result"
            placeholder=""
            extra="mb-3 !rounded-none !border-[#000000] !border-t-0 dark:border-gray-900"
            value={values?.result}
            rows={2}
          />
        )}
      </div>

      <div className="mb-5 flex w-full flex-nowrap">
        <div className="flex min-h-[46px] border border-r-0 border-[#000000] p-3 text-center text-sm font-bold dark:border-gray-900">
          Açıklama:
        </div>

        <div className="h-auto w-full">
          {variant && variant === 'value' ? (
            <div className="flex min-h-[46px] items-center border border-[#000000] px-2 py-2 text-sm dark:border-gray-900">
              {values?.description}
            </div>
          ) : (
            <TextArea
              onChange={handleValues}
              id="description"
              name="description"
              placeholder=""
              extra="!rounded-none !border-[#000000] dark:border-gray-900"
              rows={1}
              value={values?.description}
            />
          )}
        </div>
      </div>

      <div className="mb-5 flex w-full justify-end">
        <div className="mr-5 flex flex-col gap-2 text-sm">
          <div>Onaylayan / QC</div>
          <div className="font-bold">{values?.createdBy}</div>
        </div>
      </div>

      {variant && variant === 'input' ? (
        <div className="flex gap-4">
          <Button
            loading={isSubmittingUnaccept}
            text="KAYDET"
            extra="w-[60px] h-[40px]"
            onClick={handleSubmit}
          />
          <Button
            text="GERİ"
            extra="w-[60px] bg-red-700  h-[40px]"
            onClick={handleClose}
          />
        </div>
      ) : null}
    </div>
  );
}
