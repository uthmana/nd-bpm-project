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
  removeMillisecondsAndUTC,
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

export default function InvoiceForm(props: {
  onSubmit: (e: any, d: any) => void;
  editData?: any;
  title?: string;
  info?: any;
  isSubmitting?: boolean;
}) {
  const { info, editData, title, onSubmit, isSubmitting } = props;

  const isUpdate = editData && editData?.id ? true : false;
  const [fault, setFault] = useState(info || {});
  const [error, setError] = useState(false);
  const [formTouch, setFormTouch] = useState(isUpdate);
  const [platingsOpt, setPlatingsOpt] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [values, setValues] = useState(
    isUpdate
      ? editData
      : {
          invoiceDate: '',
          amount: null,
          vat: null,
          totalAmount: null,
          currency: '',
          description: '',
          customerId: '',
          createdBy: '',
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
      },
      isUpdate,
    );
  };

  const onCustomerSelect = (event) => {
    if (!event.target?.value) return;
    const stock = JSON.parse(event.target?.value);
    const { product_code, product_name, inventory, date, customer } = stock;
    setValues({
      ...values,
      customerName: customer?.company_name,
      product: product_name,
      productCode: product_code,
      quantity: inventory,
      arrivalDate: removeMillisecondsAndUTC(date),
    });
  };

  const currencies = [
    { label: 'TL', value: 'TL' },
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
  ];

  return (
    <>
      <div className="w-full">
        <NextLink
          href="/admin/invoice"
          className="mb-3 flex  w-fit items-center gap-2 text-sm dark:text-white"
        >
          <span>
            <MdOutlineArrowBack />
          </span>
          Tüm İrsalyeler
        </NextLink>
        <h1 className="mb-8 text-center text-2xl font-bold md:text-4xl">
          {title}
        </h1>
        {error ? (
          <p className="mb-3 w-full rounded-md bg-red-500 p-2 text-center text-sm  font-bold text-white">
            Lütfen ilgili kontrol alanları boş bırakılmamalı.
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <Select
              extra="pt-1"
              label="Müşteri Adı"
              onChange={onCustomerSelect}
            >
              {customers.map((item, idx) => {
                return (
                  <option
                    key={idx}
                    value={JSON.stringify(item)}
                    selected={
                      values.customerName === item.customer?.company_name
                    }
                  >
                    {item.customer?.company_name || item.customer?.rep_name}
                  </option>
                );
              })}
            </Select>

            <InputField
              label="İrsalye Tarihi"
              onChange={handleValues}
              type="datetime-local"
              id="invoiceDate"
              name="invoiceDate"
              placeholder="İrsalye Tarihi"
              extra="mb-2"
              value={values.invoiceDate}
            />
          </div>

          <div className="mb-4">
            <h2 className="mb-4 text-sm font-bold">Ürünleri</h2>
            <div className="mb-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
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
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <InputField
              label="Toplam Miktar"
              onChange={handleValues}
              type="number"
              id="amount"
              name="amount"
              placeholder="Toplam Miktar"
              extra="mb-2"
              value={values.amount}
            />

            <InputField
              label="KDV"
              onChange={handleValues}
              type="number"
              id="vat"
              name="vat"
              placeholder="kdv"
              extra="mb-2"
              value={values.vat}
            />
            <InputField
              label="Genel Toplam"
              onChange={handleValues}
              type="number"
              id="totalAmount"
              name="totalAmount"
              placeholder="Genel Toplam"
              extra="mb-2"
              value={values.totalAmount}
            />
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <Select
              extra="pt-1 max-w-[200px]"
              label="Para Birirmi"
              onChange={handleValues}
            >
              {currencies.map((item, idx) => {
                return (
                  <option key={idx} value={item.value}>
                    {item.label}
                  </option>
                );
              })}
            </Select>
          </div>

          <div className="w-full">
            <TextArea
              label="Açıklama"
              onChange={handleValues}
              id="description"
              name="description"
              placeholder="Açıklama"
              extra="mb-8"
              value={values.description}
            />
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
          <p>Oluşturan: {editData?.createdBy}</p>
          <p>
            Oluşturulma Tarihi:{' '}
            {editData?.createdAt ? formatDateTime(editData?.createdAt) : ''}
          </p>
        </div>
        <div>
          <p>Güncelleyen: {editData?.updatedBy}</p>
          <p>
            Güncelleme Tarihi:{' '}
            {editData?.updatedAt ? formatDateTime(editData?.updatedAt) : ''}
          </p>
        </div>
      </div>
    </>
  );
}
