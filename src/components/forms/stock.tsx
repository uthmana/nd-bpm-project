'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import InputField from 'components/fields/InputField';
import Button from 'components/button/button';
import Select from 'components/select/page';
import { MdOutlineArrowBack } from 'react-icons/md';
import TextArea from 'components/fields/textArea';
import { log } from 'utils';
import Upload from 'components/upload';

type StockObj = {
  product_code: string;
  product_name: string;
  product_barcode: string;
  inventory: number;
  current_price: string;
  description: string;
  main_group: string;
  group1: string;
  group2: string;
  brand: string;
  unit: string;
  curency: string;
  image: string;
  customerId: string;
};

export default function Stock(props: {
  onSubmit: (e: any) => void;
  data?: StockObj;
  title: string;
  loading: boolean;
  customerData?: any;
}) {
  const { onSubmit, data, title, loading, customerData } = props;
  const currency = ['TRY', 'USD'];

  const initialValues = data
    ? data
    : {
        product_code: '',
        product_name: '',
        product_barcode: '',
        inventory: 1,
        current_price: '',
        description: '',
        main_group: '',
        group1: '',
        group2: '',
        brand: '',
        unit: '',
        curency: 'TRY',
        image: '',
        customerId: '',
      };

  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState(false);
  const [file, setFile] = useState(
    initialValues.image ? initialValues.image : '',
  );

  const handleValues = (event) => {
    setError(false);
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { product_name, product_code, current_price, customerId } = values;
    if (!product_name || !product_code || !current_price || !customerId) {
      setError(true);
    }
    onSubmit({
      ...values,
      inventory: parseInt(values.inventory.toString()),
      image: file,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[780px] rounded-[20px] bg-white p-5 dark:bg-opacity-10"
    >
      <NextLink
        href="/admin/stock"
        className="flex items-center gap-2 text-sm dark:text-white"
      >
        <span>
          <MdOutlineArrowBack />
        </span>
        Stok
      </NextLink>

      {title ? (
        <h1 className="my-5 text-center text-[24px] font-bold dark:text-white">
          {title}
        </h1>
      ) : null}

      {error ? (
        <p className="mb-3 w-full rounded-md bg-red-500 p-2 text-center text-sm  font-bold text-white">
          Lütfen <b> Müşteri </b>, <b> Ürün adi</b>,<b> Ürün kodu</b>,{' '}
          <b>Fiyatı</b> ve Para birimi alanları boş bırakılmamalı !
        </p>
      ) : null}

      <Select
        extra="pt-1 mb-3"
        label="Müşteri"
        onChange={handleValues}
        name="customerId"
      >
        <option value="">Müşteri Seç</option>
        {customerData.map((item, idx) => {
          return (
            <option
              value={item.id}
              key={idx}
              selected={data ? data?.customerId === item.id : null}
            >
              {item.company_name}
            </option>
          );
        })}
      </Select>

      <div className="mb-2 flex flex-col gap-3 sm:flex-row">
        <InputField
          label="Ürün Adı"
          onChange={handleValues}
          type="text"
          id="product_name"
          name="product_name"
          placeholder="Product Name"
          extra="mb-2"
          value={values.product_name}
        />
        <InputField
          label="Ürün kodu"
          onChange={handleValues}
          type="text"
          id="product_code"
          name="product_code"
          placeholder="Ürün kodu"
          extra="mb-2"
          value={values.product_code}
        />

        <InputField
          label="Ürün Barkod"
          onChange={handleValues}
          type="text"
          id="product_barcode"
          name="product_barcode"
          placeholder="Ürün Barkod"
          extra="mb-2"
          value={values.product_barcode}
        />
      </div>

      <div className="mb-2 flex flex-col gap-3 sm:flex-row">
        <InputField
          label="Ana Grup"
          onChange={handleValues}
          type="text"
          id="main_group"
          name="main_group"
          placeholder="Ana Grup"
          extra="mb-2"
          value={values.main_group}
        />
        <InputField
          label="Grup1"
          onChange={handleValues}
          type="text"
          id="group1"
          name="group1"
          placeholder="Grup1"
          extra="mb-2"
          value={values.group1}
        />
        <InputField
          label="Grup2"
          onChange={handleValues}
          type="text"
          id="group2"
          name="group2"
          placeholder="Grup2"
          extra="mb-2"
          value={values.group2}
        />
      </div>

      <div className="mb-2 flex flex-col gap-3 sm:flex-row">
        <InputField
          label="Marka"
          onChange={handleValues}
          type="text"
          id="brand"
          name="brand"
          placeholder="Marka"
          extra="mb-2"
          value={values.brand}
        />

        <InputField
          label="Envanter"
          onChange={handleValues}
          type="number"
          id="inventory"
          name="inventory"
          placeholder="Envanter"
          extra="mb-2"
          min={1}
          value={values.inventory}
        />
        <InputField
          label="Birim"
          onChange={handleValues}
          type="text"
          id="unit"
          name="unit"
          placeholder="Birim"
          extra="mb-2"
          value={values.unit}
        />
      </div>

      <div className="mb-2 flex flex-col gap-3 sm:flex-row">
        <InputField
          label="Anlık Maliyet Fiyatı"
          onChange={handleValues}
          type="text"
          id="current_price"
          name="current_price"
          placeholder="22.99"
          extra="mb-2"
          value={values.current_price}
        />
        <Select
          extra="pt-1"
          label="Para Birimi"
          onChange={handleValues}
          name="curency"
        >
          {currency.map((item, idx) => {
            return (
              <option
                value={item}
                key={idx}
                selected={data ? data?.curency === item : idx === 0}
              >
                {item}
              </option>
            );
          })}
        </Select>
      </div>

      <div className="my-3">
        <Upload
          onChange={(val) => setFile(val)}
          fileType="all"
          multiple={false}
          _fileName={initialValues.image ? initialValues.image : ''}
          _filePath={
            initialValues.image ? '/uploads/' + initialValues.image : ''
          }
        />
      </div>

      <div>
        <TextArea
          label="Açıklama"
          onChange={handleValues}
          id="description"
          name="description"
          placeholder="Description"
          extra="mb-8"
          value={values.description}
        />
      </div>

      <Button loading={loading} extra="mt-4" text="SAVE" />
    </form>
  );
}
