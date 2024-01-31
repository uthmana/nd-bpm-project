'use client';

import React, { useState } from 'react';
import {
  formatDateTime,
  removeMillisecondsAndUTC,
  convertToISO8601,
} from 'utils';
import Checkbox from 'components/checkbox';
import TextArea from 'components/fields/textArea';
import Button from 'components/button/button';
import Select from 'components/select/page';
import { MdOutlineArrowBack } from 'react-icons/md';
import NextLink from 'next/link';
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
  const [error, setError] = useState(false);
  const [formTouch, setFormTouch] = useState(isUpdate);
  const [customers, setCustomers] = useState(info || []);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);

  const [values, setValues] = useState(
    isUpdate
      ? editData
      : {
          invoiceDate: '',
          amount: null,
          vat: null,
          totalAmount: null,
          currency: 'TL',
          description: '',
          customerId: '',
          createdBy: '',
          rep_name: '',
          tax_Office: '',
          taxNo: '',
          address: '',
        },
  );

  const handleValues = (event) => {
    setError(false);
    setFormTouch(false);
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  const handleProduct = (e) => {
    setError(false);
    setFormTouch(false);
    const value = JSON.parse(e.target.value);
    if (e.target.checked) {
      const existedVal = [...selectedProduct].filter((item) => {
        return item.id === value.id;
      });

      if (existedVal.length > 0) {
        const filteredVal = [...selectedProduct].filter((item) => {
          return item.id !== value.id;
        });
        setSelectedProduct(filteredVal);
        return;
      }
      setSelectedProduct([...selectedProduct, value]);
      return;
    }
    setSelectedProduct(
      [...selectedProduct].filter((item) => {
        return item.id !== value.id;
      }),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { invoiceDate, customerId, tax_Office, taxNo, address } = values;
    if (
      selectedProduct.length === 0 ||
      !customerId ||
      !invoiceDate ||
      !tax_Office ||
      !taxNo ||
      !address
    ) {
      setError(true);
      window.scroll(100, 0);
      return;
    }

    onSubmit(
      {
        ...values,
        invoiceDate: convertToISO8601(values.invoiceDate),
        process: selectedProduct,
      },
      isUpdate,
    );
  };

  const onCustomerSelect = (event) => {
    if (!event.target?.value) return;
    const processed = JSON.parse(event.target?.value);
    const { process, customer } = processed;
    setProducts(process);
    setValues({
      ...values,
      customerId: customer?.id,
      rep_name: customer?.rep_name,
      tax_Office: customer?.tax_Office,
      taxNo: customer?.taxNo,
      address: customer?.address,
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
            Lütfen zorunlu alanları boş bırakılmamalı.
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <Select
              extra="pt-1"
              label="Müşteri Adı"
              onChange={onCustomerSelect}
              name="customerName"
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
              required={true}
            />
          </div>

          <div className="mb-8 pl-2">
            <h2 className="text-md mb-4 font-bold">
              Ürün <span className="text-red-400">*</span>
            </h2>
            <div className="mb-6 grid w-full grid-cols-1">
              <div className="grid w-full grid-cols-6 gap-1 border-b font-bold">
                <div>No</div>
                <div>Ürün</div>
                <div>Uygulama</div>
                <div>Standart</div>
                <div>Renk</div>
                <div>Miktar</div>
              </div>

              {products.length > 0 ? (
                products.map((item, idx) => {
                  return (
                    <label
                      className="flex cursor-pointer items-center"
                      key={item.id}
                    >
                      <div className="grid w-full grid-cols-6 items-center gap-1 border-b py-2 text-sm font-bold text-navy-700 dark:text-white">
                        <div>
                          <Checkbox
                            name="plating"
                            colorscheme="brandScheme"
                            checked={
                              isUpdate ? values.products.includes(item) : false
                            }
                            onChange={handleProduct}
                            value={JSON.stringify(item)}
                          />
                        </div>
                        <div>{item.product}</div>
                        <div>{item.application}</div>
                        <div>{item.standard}</div>
                        <div>{item.color}</div>
                        <div>{item.quantity}</div>
                      </div>
                    </label>
                  );
                })
              ) : (
                <div className="flex min-h-[100px] items-center justify-center opacity-40">
                  Müşteri adi seçmeniz gerekiyor.
                </div>
              )}
            </div>
          </div>

          <div className="w-full">
            <TextArea
              label="Adres"
              onChange={handleValues}
              id="address"
              name="address"
              placeholder="Adres"
              extra="mb-8"
              value={values.address}
            />
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <InputField
              label="Sorumlu"
              onChange={handleValues}
              type="text"
              id="rep_name"
              name="rep_name"
              placeholder="Sorumlu"
              extra="mb-2"
              value={values.rep_name}
              required={true}
            />

            <InputField
              label="Vergi Dairesi"
              onChange={handleValues}
              type="text"
              id="tax_Office"
              name="tax_Office"
              placeholder="Vergi Dairesi"
              extra="mb-2"
              value={values.tax_Office}
              required={true}
            />
            <InputField
              label="Vergi No"
              onChange={handleValues}
              type="text"
              id="taxNo"
              name="taxNo"
              placeholder="Vergi No"
              extra="mb-2"
              value={values.taxNo}
              required={true}
            />
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
