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

import Upload from 'components/upload';
import TextArea from 'components/fields/textArea';
import Button from 'components/button';
import Select from 'components/select';
import Radio from 'components/radio';
import InputField from 'components/fields/InputField';
import ControlHeader from './finalControl/controlHeader';
import { useSession } from 'next-auth/react';

export default function EntryControlForm(props: {
  info: any;
  data: any;
  title?: string;
  onSubmit?: (e: any, f: boolean) => void;
  isSubmitting?: boolean;
  variant?: string;
}) {
  const { info, data, title, onSubmit, isSubmitting, variant = 'form' } = props;

  const isUpdate = data && data?.id ? true : false;
  const [fault, setFault] = useState(info || {});
  const [error, setError] = useState(false);
  const [formTouch, setFormTouch] = useState(isUpdate);
  const { data: session } = useSession();
  const [values, setValues] = useState(
    isUpdate
      ? data
      : {
          image: '',
          result: '',
          plating: '',
          product: '',
          deformity: '',
          remarks: '',
          productCode: '',
          dirtyThreads: '',
          productDimension: '',
          productBatchNumber: '',
          processFrequency: '',
          dimensionConfirmation: '',
          quantityConfirmation: '',
          faultId: info?.id,
          quantity: 0,
          frequencyDimension: 1,
          createdBy: session?.user?.name,
          createdAt: new Date(),
          updatedBy: session?.user?.name,
        },
  );

  const handleValues = (event) => {
    setError(false);
    setFormTouch(false);
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
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
        dimensionConfirmation: values.dimensionConfirmation === true.toString(),
        dirtyThreads: values.dirtyThreads === true.toString(),
        deformity: values.deformity === true.toString(),
        quantityConfirmation: values.quantityConfirmation === true.toString(),
        frequencyDimension:
          values.processFrequency === 'Yazılmasın'
            ? 1
            : parseInt(values.frequencyDimension),
        updatedBy: session?.user?.name,
      },
      isUpdate,
    );
  };

  return (
    <>
      <div
        className={`w-full ${variant != 'form' ? 'pointer-events-none' : ''}`}
      >
        <ControlHeader
          data={fault}
          variant="entry"
          title="Ürün Girişi Kontrol Formu"
          titleEn="Product Entry Control Form"
        />
        {error ? (
          <p className="mb-3 w-full rounded-md bg-red-500 p-2 text-center text-sm  font-bold text-white">
            Lütfen ilgili kontrol alanları boş bırakılmamalı.
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="w-full">
          <h2 className="mb-4 text-sm font-bold">kaplama</h2>
          <div className="mb-8 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
            {platings.map((item, idx) => {
              return (
                <label className="flex cursor-pointer items-center" key={idx}>
                  <Radio
                    name="plating"
                    value={item}
                    onChange={handleValues}
                    checked={values.plating === item}
                    key={item}
                  />
                  <p className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                    {item}
                  </p>
                </label>
              );
            })}
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
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
              label="Ezik/ Kırık Diş"
              onChange={handleValues}
              name="deformity"
            >
              {dirtyConfirmation.map((item, idx) => {
                return (
                  <option
                    value={item.value.toString()}
                    key={idx}
                    selected={isUpdate ? values.deformity === item.value : null}
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
                label="Frekans Aralığı (dk)"
                onChange={handleValues}
                type="number"
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
            <Upload
              label="İlgili Doküman"
              id="image"
              name="image"
              onChange={handleValues}
              value={values.image}
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
          {variant != 'form' ? null : (
            <Button
              disabled={formTouch}
              loading={isSubmitting}
              extra="mt-4"
              text="KAYDET"
            />
          )}
        </form>
      </div>
    </>
  );
}
