'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import InputField from 'components/fields/InputField';
import Button from 'components/button/button';
import Select from 'components/select/page';
import { MdOutlineArrowBack } from 'react-icons/md';
import TextArea from 'components/fields/textArea';
import { log } from 'utils';

type StockObj = {
  product_code: string;
  product_name: string;
  product_barcode: string;
  inventory: 0;
  current_price: string;
  description: string;
  main_group: string;
  group1: string;
  group2: string;
  brand: string;
  unit: string;
  curency: string;
};

export default function Stock(props: {
  onSubmit: (e: any) => void;
  data?: StockObj;
  title: string;
  loading: boolean;
}) {
  const { onSubmit, data, title, loading } = props;
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
      };

  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState(false);

  //TODO: add input validation
  const handleValues = (event) => {
    setError(false);
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
    log(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { product_name, product_code, current_price } = values;
    if (!product_name || !product_code || !current_price) {
      setError(true);
    }
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[580px] rounded-[20px] bg-white p-5 dark:bg-opacity-10"
    >
      <NextLink href="/admin/stock" className="flex items-center gap-2 text-sm">
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
          Lütfen boş <b> ürün adi</b>, <b> ürün kodu</b>, <b>fiyatı</b> ve para
          birimi alanları doldurmanız lazım !
        </p>
      ) : null}

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
          value={values.inventory?.toString()}
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
          extra="w-[160px] pt-1"
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
