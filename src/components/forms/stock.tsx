'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import InputField from 'components/fields/InputField';
import Button from 'components/button/button';
import Select from 'components/select/page';
import { MdOutlineArrowBack } from 'react-icons/md';
import TextArea from 'components/fields/textArea';

type userForm = {
  onSubmit: (e: any) => void;
  data?: StockObj;
  title?: string;
};

type StockObj = {
  product_name: string;
  stock_location: string;
  quantity: number;
  price: string;
  description: string;
  date: string;
  vendor: string;
};

export default function Stock({ onSubmit, data, title }: userForm) {
  const initialValues = data
    ? data
    : {
        product_name: '',
        stock_location: '',
        quantity: 0,
        price: '',
        description: '',
        date: '',
        vendor: '',
      };
  const [values, setValues] = useState(initialValues);

  //TODO: add input validation
  const handleValues = (event) => {
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
    console.log(values);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-[400px] rounded-[20px] bg-white p-5 dark:bg-opacity-10"
    >
      <NextLink href="/admin/stock" className="flex items-center gap-2 text-sm">
        <span>
          <MdOutlineArrowBack />
        </span>
        Back to Stock
      </NextLink>

      {title ? (
        <h1 className="my-5 text-center text-[24px] font-bold dark:text-white">
          {title}
        </h1>
      ) : null}

      <InputField
        label="Product Name"
        onChange={handleValues}
        type="text"
        id="product_name"
        name="product_name"
        placeholder="Product Name"
        extra="mb-2"
        value={values.product_name}
      />
      <InputField
        label="Stock Location"
        onChange={handleValues}
        type="text"
        id="stock_location"
        name="stock_location"
        placeholder="Stock Location"
        extra="mb-2"
        value={values.stock_location}
      />
      <InputField
        label="Quantity"
        onChange={handleValues}
        type="number"
        id="quantity"
        name="quantity"
        placeholder="Quantity"
        extra="mb-2"
        value={values.quantity.toString()}
      />
      <InputField
        label="Unit Price"
        onChange={handleValues}
        type="text"
        id="price"
        name="price"
        placeholder="Unit Price"
        extra="mb-2"
        value={values.price}
      />
      <InputField
        label="Vendor"
        onChange={handleValues}
        type="text"
        id="vendor"
        name="vendor"
        placeholder="Vendor"
        extra="mb-2"
        value={values.vendor}
      />
      <InputField
        label="Date"
        onChange={handleValues}
        type="date"
        id="date"
        name="date"
        placeholder="Date"
        extra="mb-2"
        value={values.date}
      />
      <TextArea
        label="Description"
        onChange={handleValues}
        id="description"
        name="description"
        placeholder="Description"
        extra="mb-2"
        value={values.description}
      />

      <Button extra="mt-4" text="SAVE" />
    </form>
  );
}
