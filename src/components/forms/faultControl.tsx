'use client';

import React, { useState } from 'react';
import {
  formatDateTime,
  platings,
  processConfirmation,
  materials,
  dirtyConfirmation,
  confirmation,
  results,
  faultInfo,
  infoTranslate,
} from 'utils';
import Checkbox from 'components/checkbox';
import Upload from 'components/upload';
import TextArea from 'components/fields/textArea';
import Button from 'components/button/button';
import Select from 'components/select/page';
import Radio from 'components/radio';
import { MdOutlineArrowBack } from 'react-icons/md';
import NextLink from 'next/link';
import FileViewer from 'components/fileViewer';
import InputField from 'components/fields/InputField';

export default function EntryControlForm({
  info,
  data,
  title,
  onSubmit,
  isSubmitting,
}) {
  const isUpdate = data && data?.id ? true : false;
  const [fault, setFault] = useState(info || {});
  const [error, setError] = useState(false);
  const [file, setFile] = useState('');
  const [formTouch, setFormTouch] = useState(isUpdate);
  const [platingsOpt, setPlatingsOpt] = useState(
    isUpdate && data.plating?.length > 0 ? data.plating.split(',') : [],
  );

  const [values, setValues] = useState(
    isUpdate
      ? data
      : {
          image: '',
          result: '',
          plating: '',
          product: '',
          quantity: 0,
          productCode: '',
          productDimension: '',
          productBatchNumber: '',
          processFrequency: '',
          dimensionConfirmation: '',
          dirtyThreads: '',
          quantityConfirmation: '',
          remarks: '',
          faultId: info?.id,
          frequencyDimension: '',
        },
  );

  const handleValues = (event) => {
    setError(false);
    setFormTouch(false);
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  const handlePlating = (e) => {
    setError(false);
    setFormTouch(false);
    const value = e.target.value;
    if (e.target.checked) {
      if (![...platingsOpt].includes(value)) {
        setPlatingsOpt([...platingsOpt, value]);
      }
      return;
    }
    const _plating = [...platingsOpt].filter((item) => {
      return item !== value;
    });
    setPlatingsOpt(_plating);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { result } = values;
    if (!result) {
      setError(true);
      window.scroll(100, 0);
      return;
    }

    onSubmit(
      {
        ...values,
        image: file,
        plating: platingsOpt.join(','),
        dimensionConfirmation:
          values.dimensionConfirmation?.toString() === 'true',
        dirtyThreads: values.dirtyThreads?.toString() === 'true',
        quantityConfirmation:
          values.quantityConfirmation?.toString() === 'true',
      },
      isUpdate,
    );
  };

  return (
    <>
      <div className="w-full">
        <NextLink
          href="/admin/entry"
          className="mb-3 flex  w-fit items-center gap-2 text-sm dark:text-white"
        >
          <span>
            <MdOutlineArrowBack />
          </span>
          Ürün Girişe
        </NextLink>
        <h1 className="dark:white mb-8 text-center text-2xl font-bold md:text-4xl">
          {title}
        </h1>
        <div className="mb-10 grid w-full grid-cols-1 gap-2  sm:grid-cols-2 md:grid-cols-3">
          {Object.entries(fault).map(([key, val]: any, index) => {
            if (faultInfo.includes(key)) {
              return (
                <div key={index} className="mx-2  flex flex-col flex-nowrap">
                  <h4 className="mb-0 italic">{infoTranslate[key]}</h4>
                  {key === 'arrivalDate' ? (
                    <p className="font-bold"> {formatDateTime(val)} </p>
                  ) : key === 'technicalDrawingAttachment' ? (
                    <FileViewer file={val} />
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
          <h2 className="mb-4 text-sm font-bold">kaplama</h2>
          <div className="mb-12 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
            {platings.map((item, idx) => {
              return (
                <label className="flex cursor-pointer items-center" key={idx}>
                  <Checkbox
                    name="plating"
                    colorscheme="brandScheme"
                    me="10px"
                    checked={isUpdate ? values.plating.includes(item) : false}
                    onChange={handlePlating}
                    value={item}
                  />
                  <p className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                    {item}
                  </p>
                </label>
              );
            })}
          </div>

          <div className="mb-8 flex flex-col gap-3 sm:flex-row">
            <Select
              extra="pt-1"
              label="Malzeme Türü"
              onChange={handleValues}
              name="productDimension"
            >
              {materials.map((item, idx) => {
                return (
                  <option
                    value={item}
                    key={idx}
                    selected={
                      isUpdate ? values.productDimension === item : null
                    }
                  >
                    {item}
                  </option>
                );
              })}
            </Select>

            <Select
              extra="pt-1"
              label="Ürün Boyutlari"
              onChange={handleValues}
              name="dimensionConfirmation"
            >
              {confirmation.map((item, idx) => {
                return (
                  <option
                    value={item.value.toString()}
                    key={idx}
                    selected={
                      isUpdate
                        ? values.dimensionConfirmation === item.value
                        : null
                    }
                  >
                    {item.name}
                  </option>
                );
              })}
            </Select>

            <Select
              extra="pt-1"
              label="Miktar"
              onChange={handleValues}
              name="quantityConfirmation"
            >
              {confirmation.map((item, idx) => {
                return (
                  <option
                    value={item.value.toString()}
                    key={idx}
                    selected={
                      isUpdate
                        ? values.quantityConfirmation === item.value
                        : null
                    }
                  >
                    {item.name}
                  </option>
                );
              })}
            </Select>
          </div>
          <div className="mb-8 grid  grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            <Select
              extra="pt-1"
              label="Temizleme"
              onChange={handleValues}
              name="dirtyThreads"
            >
              {dirtyConfirmation.map((item, idx) => {
                return (
                  <option
                    value={item.value.toString()}
                    key={idx}
                    selected={
                      isUpdate ? values.dirtyThreads === item.value : null
                    }
                  >
                    {item.name}
                  </option>
                );
              })}
            </Select>

            <Select
              extra="pt-1"
              label="Proses Frekansi"
              onChange={handleValues}
              name="processFrequency"
            >
              {processConfirmation.map((item, idx) => {
                return (
                  <option
                    value={item}
                    key={idx}
                    selected={
                      isUpdate ? values.processFrequency === item : null
                    }
                  >
                    {item}
                  </option>
                );
              })}
            </Select>

            {values.processFrequency === 'Yazılsın' ? (
              <InputField
                label="Frekans Aralığı"
                onChange={handleValues}
                type="text"
                id="frequencyDimension"
                name="frequencyDimension"
                placeholder="0"
                extra="mb-2"
                value={values.frequencyDimension}
                required={true}
              />
            ) : null}
          </div>

          <div className="mb-6">
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
          </div>

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
            <div className="grid w-full grid-cols-2 justify-center gap-2 sm:grid-cols-4">
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
            text="SAVE"
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
