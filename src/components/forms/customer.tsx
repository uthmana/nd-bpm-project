'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import InputField from 'components/fields/InputField';
import Button from 'components/button/button';
import Select from 'components/select/page';
import { MdOutlineArrowBack } from 'react-icons/md';
import TextArea from 'components/fields/textArea';
import { log } from 'utils';

type CustomerObj = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  postalCode: string;
  company_name: string;
  phoneNumber: string;
  phoneNumber2: string;
  code: string;
  definition: string;
  taxNo: string;
  tax_Office: string;
};

type userForm = {
  onSubmit: (e: any) => void;
  data?: CustomerObj;
  title?: string;
  loading?: boolean;
};

export default function Customer({ onSubmit, data, title, loading }: userForm) {
  const initialValues = data
    ? data
    : {
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        postalCode: '',
        company_name: '',
        phoneNumber: '',
        phoneNumber2: '',
        code: '',
        definition: '',
        taxNo: '',
        tax_Office: '',
      };
  const [values, setValues] = useState(initialValues);

  //TODO: add input validation
  const handleValues = (event) => {
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    //TODO: Add form validation

    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[400px] rounded-[20px] bg-white p-5 dark:bg-opacity-10"
    >
      <NextLink
        href="/admin/customer"
        className="flex items-center gap-2 text-sm dark:text-white"
      >
        <span>
          <MdOutlineArrowBack />
        </span>
        Müşteriler
      </NextLink>

      {title ? (
        <h1 className="my-5 text-center text-[24px] font-bold dark:text-white">
          {title}
        </h1>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row">
        <InputField
          label="Ad"
          onChange={handleValues}
          type="text"
          id="first_name"
          name="first_name"
          placeholder="Ad"
          extra="mb-2"
          value={values.first_name}
        />
        <InputField
          label="Soyad"
          onChange={handleValues}
          type="text"
          id="last_name"
          name="last_name"
          placeholder="Soyad"
          extra="mb-2"
          value={values.last_name}
        />
      </div>
      <InputField
        label="Email"
        onChange={handleValues}
        type="text"
        id="email"
        name="email"
        placeholder="Email"
        extra="mb-2"
        value={values.email}
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <InputField
          label="Telefon 1"
          onChange={handleValues}
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          placeholder="Telefon 1"
          extra="mb-2"
          value={values.phoneNumber}
        />

        <InputField
          label="Telefon 2"
          onChange={handleValues}
          type="text"
          id="phoneNumber2"
          name="phoneNumber2"
          placeholder="Telefon 2"
          extra="mb-2"
          value={values.phoneNumber2}
        />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <InputField
          label="Postal Kodu"
          onChange={handleValues}
          type="text"
          id="postalCode"
          name="postalCode"
          placeholder="Postal Kodu"
          extra="mb-2"
          value={values.postalCode}
        />
        <InputField
          label="Mştr kodu"
          onChange={handleValues}
          type="text"
          id="code"
          name="code"
          placeholder="Mştr kodu"
          extra="mb-2"
          value={values.code}
        />
      </div>
      <TextArea
        label="Address"
        onChange={handleValues}
        id="address"
        name="address"
        placeholder="Address"
        extra="mb-2"
        value={values.address}
      />

      <InputField
        label="Şirket İsmi"
        onChange={handleValues}
        type="text"
        id="company_name"
        name="company_name"
        placeholder="Şirket İsmi"
        extra="mb-2"
        value={values.company_name}
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <InputField
          label="Vergi No."
          onChange={handleValues}
          type="text"
          id="taxNo"
          name="taxNo"
          placeholder="Vergi No."
          extra="mb-2"
          value={values.taxNo}
        />
        <InputField
          label="Vergi Ofisi"
          onChange={handleValues}
          type="text"
          id="tax_Office"
          name="tax_Office"
          placeholder="Vergi Ofis"
          extra="mb-2"
          value={values.tax_Office}
        />
      </div>

      <TextArea
        label="Açıklama"
        onChange={handleValues}
        id="definition"
        name="definition"
        placeholder="Açıklama"
        extra="mb-2"
        value={values.definition}
      />

      <Button loading={loading} extra="mt-4" text="SAVE" />
    </form>
  );
}
