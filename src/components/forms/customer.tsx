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
  rep_name: string;
  email: string;
  email_2: string;
  address: string;
  postalCode: string;
  company_name: string;
  phoneNumber: string;
  phoneNumber2: string;
  code: string;
  definition: string;
  taxNo: string;
  tax_Office: string;
  taxOfficeCode: string;
  cardType: string; //ALICI_SATICI-ALICI-SATICI
  country_code: string;
  province_code: string;
  district_code: string;
  currency: string;
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
        rep_name: '',
        email: '',
        email_2: '',
        address: '',
        postalCode: '',
        company_name: '',
        phoneNumber: '',
        phoneNumber2: '',
        code: '',
        definition: '',
        taxNo: '',
        tax_Office: '',
        taxOfficeCode: '',
        country_code: '',
        province_code: '',
        district_code: '',
        currency: 'TL',
        cardType: 'ALICI_SATICI',
      };
  const [values, setValues] = useState(initialValues);
  const cardTypes = ['ALICI_SATICI', 'ALICI', 'SATICI'];
  const currencies = ['TL', 'USD'];

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
      className="mx-auto w-full max-w-[600px] rounded-[20px] bg-white p-5 dark:bg-opacity-10"
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
          label="Şirket İsmi"
          onChange={handleValues}
          type="text"
          id="company_name"
          name="company_name"
          placeholder="Şirket İsmi"
          extra="mb-2 !w-full"
          value={values.company_name}
        />
        <InputField
          label="Sorumlu"
          onChange={handleValues}
          type="text"
          id="rep_name"
          name="rep_name"
          placeholder="Sorumlu"
          extra="mb-2 w-full"
          value={values.rep_name}
        />
      </div>
      <InputField
        label="E-Posta"
        onChange={handleValues}
        type="text"
        id="email"
        name="email"
        placeholder="e-posta"
        extra="mb-2"
        value={values.email}
      />

      <InputField
        label="E-Posta 2"
        onChange={handleValues}
        type="text"
        id="email_2"
        name="email_2"
        placeholder="e-posta"
        extra="mb-2"
        value={values.email_2}
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
          label="Mştr kodu"
          onChange={handleValues}
          type="text"
          id="code"
          name="code"
          placeholder="Mştr kodu"
          extra="mb-2"
          value={values.code}
        />

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
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Select
          extra="w-full mb-3"
          label="Kart Türü"
          onChange={handleValues}
          name="cardType"
        >
          {cardTypes.map((item, idx) => {
            return (
              <option
                value={item}
                key={idx}
                selected={data ? data?.cardType === item : idx === 0}
              >
                {item}
              </option>
            );
          })}
        </Select>

        <Select
          extra="w-full mb-3"
          label="Para Birimi"
          onChange={handleValues}
          name="currency"
        >
          {currencies.map((item, idx) => {
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

      <TextArea
        label="Address"
        onChange={handleValues}
        id="address"
        name="address"
        placeholder="Address"
        extra="mb-2"
        value={values.address}
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
        <InputField
          label="Vergi Ofis kodu"
          onChange={handleValues}
          type="text"
          id="taxOfficeCode"
          name="taxOfficeCode"
          placeholder="Vergi Ofis kodu"
          extra="mb-2"
          value={values.taxOfficeCode}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <InputField
          label="Ülke Kodu"
          onChange={handleValues}
          type="text"
          id="country_code"
          name="country_code"
          placeholder="Ülke Kodu"
          extra="mb-2"
          value={values.country_code}
        />
        <InputField
          label="İl Kodu"
          onChange={handleValues}
          type="text"
          id="province_code"
          name="province_code"
          placeholder="İl Kodu"
          extra="mb-2"
          value={values.province_code}
        />
        <InputField
          label="İlçe Kodu"
          onChange={handleValues}
          type="text"
          id="district_code"
          name="district_code"
          placeholder="İlçe Kodu"
          extra="mb-2"
          value={values.district_code}
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
