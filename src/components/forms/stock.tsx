'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import InputField from 'components/fields/InputField';
import Button from 'components/button';
import Select from 'components/select';
import { MdOutlineArrowBack } from 'react-icons/md';
import TextArea from 'components/fields/textArea';
import {
  generateProductCode,
  generateRandomThreeDigitNumber,
  log,
} from 'utils';
import Upload from 'components/upload';
import DataList from 'components/fields/dataList';
import { getCustomers } from 'app/lib/apiRequest';

type StockObj = {
  product_code: string;
  product_name: string;
  productBatchNumber: string;
  product_barcode: string;
  inventory: number;
  current_price: string;
  description: string;
  main_group: string;
  group1: string;
  group2: string;
  brand: string;
  unit: string;
  currency: string;
  image: string;
  customerId: string;
  company_name: string;
};

export default function Stock(props: {
  onSubmit: (e: any) => void;
  data?: StockObj;
  title: string;
  loading: boolean;
}) {
  const { onSubmit, data, title, loading } = props;
  const currency = ['TL', 'USD', 'EUR'];

  const initialValues = data
    ? data
    : {
        product_code: '',
        product_name: '',
        product_barcode: '',
        productBatchNumber: '',
        inventory: 1,
        current_price: '',
        description: '',
        main_group: '',
        group1: '',
        group2: '',
        brand: '',
        unit: '',
        currency: 'TL',
        image: '',
        customerId: '',
        company_name: '',
      };

  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState(false);

  const handleValues = (event) => {
    setError(false);
    if (event.target?.name === 'company_name') {
      if (!event.selectedData) return;
      const _customer = event.selectedData;
      log(_customer);
      const selectedCustomer = {
        customerId: _customer?.id,
        company_name: _customer?.company_name,
      };

      const customerIndex = generateRandomThreeDigitNumber();
      const product_code = generateProductCode(
        _customer?.company_name?.split(' ')[0],
        customerIndex,
      );

      setValues({ ...values, ...selectedCustomer, product_code });
      return;
    }

    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      product_name,
      product_code,
      customerId,
      company_name,
      productBatchNumber,
    } = values;
    if (
      !product_name ||
      !product_code ||
      !customerId ||
      !company_name ||
      !productBatchNumber
    ) {
      setError(true);
    }

    delete values.company_name;
    onSubmit({
      ...values,
      inventory: parseInt(values.inventory.toString()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
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
        <h1 className="dark:white mb-8 text-center text-2xl font-bold md:text-4xl">
          {title}
        </h1>
      ) : null}

      {error ? (
        <p className="mb-3 w-full rounded-md bg-red-300 p-2 text-center text-sm  font-bold text-white">
          Lütfen <b> kırmızı ile işaretlenmiş alanaları doldurunuz !</b>
        </p>
      ) : null}

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <DataList
          placeholder="Müşteri Adı"
          label="Müşteri Adı"
          id="company_name"
          name="company_name"
          listId="stock_company_name_list"
          loadOptions={getCustomers}
          required={true}
          value={values.company_name}
          onChange={handleValues}
        />

        <InputField
          label="Parti No."
          onChange={handleValues}
          type="text"
          id="productBatchNumber"
          name="productBatchNumber"
          placeholder="Parti No."
          extra="mb-2"
          value={values.productBatchNumber}
          required={true}
        />
      </div>

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
          required={true}
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
          required={true}
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

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
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
          required={true}
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

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
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
          name="currency"
          required={true}
        >
          {currency.map((item, idx) => {
            return (
              <option
                value={item}
                key={idx}
                selected={data ? data?.currency === item : idx === 0}
              >
                {item}
              </option>
            );
          })}
        </Select>
      </div>

      <div className="my-3 mb-8">
        <Upload
          label="İlgili Doküman"
          id="image"
          name="image"
          onChange={handleValues}
          value={values.image}
        />
      </div>

      <div>
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

      <Button loading={loading} extra="mt-4" text="KAYDET" />
    </form>
  );
}
