'use client';

import React, { useState } from 'react';
import { formatDateTime } from 'utils';
import Upload from 'components/upload';
import TextArea from 'components/fields/textArea';
import Button from 'components/button/button';
import Select from 'components/select/page';
import Radio from 'components/radio';
import { MdOutlineArrowBack } from 'react-icons/md';
import NextLink from 'next/link';
import InputField from 'components/fields/InputField';

export default function ProcessControlForm({
  info,
  data,
  title,
  onSubmit,
  isSubmitting,
}) {
  const isUpdate = data && data?.id ? true : false;
  const [process, setProcess] = useState(info || {});
  const [error, setError] = useState(false);
  const [formTouch, setFormTouch] = useState(isUpdate);
  const [file, setFile] = useState('');

  const processInfo = [
    'customerName',
    'product',
    'quantity',
    'application',
    'standard',
    'color',
    'productCode',
    'createdBy',
    'arrivalDate',
    'machineName',
    'product_barcode',
  ];

  const infoTranslate = {
    customerName: 'Müşteri',
    product: 'Ürün Tanımı',
    quantity: 'Miktar',
    application: 'Uygulama',
    standard: 'Standart',
    color: 'Renk',
    productCode: 'Ürün Kodu',
    createdBy: 'Personel',
    arrivalDate: 'Giriş Tarihi',
    machineName: 'Makine',
    product_barcode: 'Barkodu',
  };

  const [values, setValues] = useState(
    isUpdate
      ? data
      : {
          faultId: '',
          olcu_Kontrol: '',
          gorunum_kontrol: '',
          tork_Kontrol: '',
          paketleme: '',
          kontrol_edilen_miktar: 0,
          hatali_miktar: 0,
          nakliye_miktar: 0,
          remarks: '',
          image: '',
          createdBy: '',
          result: '',
          processId: '',
        },
  );

  const sizeConfirmation = [
    { name: 'İYİ', value: 'OK' },
    { name: 'İYİ DEĞİL', value: 'NOT_OK' },
  ];

  const results = [
    { value: 'ACCEPT', name: 'Kabul' },
    { value: 'REJECT', name: 'Ret' },
  ];

  const handleValues = (event) => {
    setError(false);
    setFormTouch(false);
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { result, tork_Kontrol, olcu_Kontrol, gorunum_kontrol } = values;
    if (!result || !tork_Kontrol || !olcu_Kontrol || !gorunum_kontrol) {
      setError(true);
      window.scroll(0, 0);
      return;
    }

    onSubmit(
      {
        ...values,
        image: file,
        kontrol_edilen_miktar: parseInt(values.kontrol_edilen_miktar),
        hatali_miktar: parseInt(values.hatali_miktar),
        nakliye_miktar: parseInt(values.nakliye_miktar),
      },
      isUpdate,
    );
  };

  return (
    <>
      <div className="w-full">
        <NextLink
          href="/admin/process"
          className="mb-3 flex  w-fit items-center gap-2 text-sm dark:text-white"
        >
          <span>
            <MdOutlineArrowBack />
          </span>
          Prosesler
        </NextLink>
        <h1 className="dark:white mb-8 text-center text-2xl font-bold md:text-4xl">
          {title}
        </h1>
        <div className="mb-10 grid w-full grid-cols-2 gap-2  sm:grid-cols-3">
          {Object.entries(process).map(([key, val]: any, index) => {
            if (processInfo.includes(key)) {
              return (
                <div key={index} className="flex flex-col flex-nowrap">
                  <h4 className="mb-0 italic">{infoTranslate[key]}</h4>
                  {key === 'arrivalDate' ? (
                    <p className="font-bold"> {formatDateTime(val)} </p>
                  ) : (
                    <p className="font-bold"> {val} </p>
                  )}
                </div>
              );
            }
          })}
        </div>
        {error ? (
          <p className="mb-3 w-full rounded-md bg-red-500 p-2 text-center text-sm  font-bold text-white">
            Lütfen ilgili kontrol alanları boş bırakılmamalı.
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row">
            <Select
              extra="pt-1"
              label="Ölçü Kontrolü"
              onChange={handleValues}
              name="olcu_Kontrol"
              required={true}
            >
              {sizeConfirmation.map((item, idx) => {
                return (
                  <option
                    value={item.value}
                    key={idx}
                    selected={
                      isUpdate ? values.olcu_Kontrol === item.value : null
                    }
                  >
                    {item.name}
                  </option>
                );
              })}
            </Select>

            <Select
              extra="pt-1"
              label="Görünüm Kontrolü"
              onChange={handleValues}
              name="gorunum_kontrol"
              required={true}
            >
              {sizeConfirmation.map((item, idx) => {
                return (
                  <option
                    value={item.value}
                    key={idx}
                    selected={
                      isUpdate ? values.gorunum_kontrol === item.value : null
                    }
                  >
                    {item.name}
                  </option>
                );
              })}
            </Select>

            <Select
              extra="pt-1"
              label="Tork Kontrolü"
              onChange={handleValues}
              name="tork_Kontrol"
              required={true}
            >
              {sizeConfirmation.map((item, idx) => {
                return (
                  <option
                    value={item.value}
                    key={idx}
                    selected={
                      isUpdate ? values.tork_Kontrol === item.value : null
                    }
                  >
                    {item.name}
                  </option>
                );
              })}
            </Select>
          </div>

          <div className="mb-8 flex flex-col gap-3 sm:flex-row">
            <InputField
              label="Kontrol Miktarı"
              onChange={handleValues}
              type="number"
              id="kontrol_edilen_miktar"
              name="kontrol_edilen_miktar"
              placeholder="Kontrol Miktarı"
              extra="mb-2"
              min={0}
              value={values.kontrol_edilen_miktar}
            />

            <InputField
              label="Hatalı Miktarı"
              onChange={handleValues}
              type="number"
              id="hatali_miktar"
              name="hatali_miktar"
              placeholder="Hatalı Miktarı"
              extra="mb-2"
              min={0}
              value={values.hatali_miktar}
            />

            <InputField
              label="Nakliye Miktarı"
              onChange={handleValues}
              type="number"
              id="nakliye_miktar"
              name="nakliye_miktar"
              placeholder="Nakliye Miktarı"
              extra="mb-2"
              min={0}
              value={values.nakliye_miktar}
            />
          </div>

          <div className="mb-8 flex flex-col gap-3 sm:flex-row">
            <InputField
              label="Paketleme"
              onChange={handleValues}
              type="text"
              id="paketleme"
              name="paketleme"
              placeholder="Paketleme"
              extra="mb-2"
              value={values.paketleme}
            />
          </div>

          {/* <div className="mb-6">
            <h2 className="mb-3 ml-3  block w-full text-sm font-bold">
              İlgili Doküman
            </h2>
            <Upload
              onChange={(val) => setFile(val)}
              fileType="all"
              multiple={false}
              _fileName={values.image}
              _filePath={isUpdate ? '/uploads/' + values.image : ''}
            />
          </div> */}

          <div className="w-full">
            <TextArea
              label="Açıklama"
              onChange={handleValues}
              id="remarks"
              name="remarks"
              placeholder="Açıklama"
              extra="mb-8"
              value={values.remarks}
            />
          </div>

          <div className="mb-10 w-full">
            <label className="mb-3 ml-3  block w-full font-bold">Sonuç</label>
            <div className="grid w-full grid-cols-2 justify-center gap-2">
              {results.map((item) => {
                return (
                  <label
                    className="flex w-full cursor-pointer items-center capitalize"
                    key={item.value}
                  >
                    <Radio
                      name="result"
                      value={item.value}
                      onChange={handleValues}
                      checked={values.result === item.value}
                    />
                    <p className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                      {item.name}
                    </p>
                  </label>
                );
              })}
            </div>
          </div>

          <Button
            disabled={formTouch}
            loading={isSubmitting}
            extra="mt-4"
            text="KAYDET"
          />
        </form>
      </div>

      <div className="mt-8 flex justify-between text-sm font-bold opacity-40">
        <div>
          <p>Oluşturan: {data?.createdBy}</p>
          <p>
            Oluşturulma Tarihi:{' '}
            {data?.createdAt ? formatDateTime(data?.createdAt) : ''}
          </p>
        </div>
        <div>
          <p>Güncelleyen: {data?.updatedBy}</p>
          <p>
            Güncelleme Tarihi:{' '}
            {data?.updatedAt ? formatDateTime(data?.updatedAt) : ''}
          </p>
        </div>
      </div>
    </>
  );
}
