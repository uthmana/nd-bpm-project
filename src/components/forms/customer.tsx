'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import InputField from 'components/fields/InputField';
import Button from 'components/button/button';
import Select from 'components/select/page';
import { MdOutlineArrowBack } from 'react-icons/md';
import TextArea from 'components/fields/textArea';
import { log } from 'utils';
import { CustomerObj } from '../../app/localTypes/table-types';

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
        email_quality: '',
        email_offer: '',
        email_accountant: '',
        address: '',
        postalCode: '',
        company_name: '',
        phoneNumber: '',
        phoneNumber_shipment: '',
        phoneNumber_quality: '',
        phoneNumber_accountant: '',
        code: '',
        definition: '',
        taxNo: '',
        tax_Office: '',
        taxOfficeCode: '',
        country_code: '',
        province_code: '',
        district_code: '',
        currency: 'TL',
        cardType: 'ALICI',
      };
  const [values, setValues] = useState(initialValues);
  const cardTypes = ['ALICI', 'ALICI_SATICI', 'SATICI'];
  const currencies = ['TL', 'USD', 'EUR'];
  const [error, setError] = useState(false);

  const handleValues = (event) => {
    setError(false);
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { taxNo, tax_Office, taxOfficeCode } = values;

    if (!taxNo || !tax_Office || !taxOfficeCode) {
      //TODO: Add form validation
      setError(true);
      return;
    }

    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
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
        <h1 className="mb-8 text-center text-2xl font-bold md:text-4xl">
          {title}
        </h1>
      ) : null}

      {error ? (
        <p className="mb-3 w-full rounded-md bg-red-300 p-2 text-center text-sm  font-bold text-white">
          Lütfen <b> kırmızı ile işaretlenmiş alanaları doldurunuz !</b>
        </p>
      ) : null}

      <div className="mb-10 flex flex-col gap-4 sm:flex-row">
        <InputField
          label="Şirket İsmi"
          onChange={handleValues}
          type="text"
          id="company_name"
          name="company_name"
          placeholder="Şirket İsmi"
          extra="mb-2 !w-full"
          value={values.company_name}
          required={true}
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
          required={true}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <InputField
          label="E-Posta"
          onChange={handleValues}
          type="text"
          id="email"
          name="email"
          placeholder="example@mail.com"
          extra="mb-2"
          value={values.email}
          required={true}
        />

        <InputField
          label="E-Posta (Kalite)"
          onChange={handleValues}
          type="text"
          id="email_quality"
          name="email_quality"
          placeholder="example@mail.com"
          extra="mb-2"
          value={values.email_quality}
        />
      </div>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row">
        <InputField
          label="E-Posta (Teklif)"
          onChange={handleValues}
          type="text"
          id="email_offer"
          name="email_offer"
          placeholder="example@mail.com"
          extra="mb-2"
          value={values.email_offer}
        />

        <InputField
          label="E-Posta (Muhasebe)"
          onChange={handleValues}
          type="text"
          id="email_accountant"
          name="email_accountant"
          placeholder="example@mail.com"
          extra="mb-2"
          value={values.email_accountant}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <InputField
          label="Telefon"
          onChange={handleValues}
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          placeholder="0224 XXX XXXX"
          extra="mb-2"
          value={values.phoneNumber}
          required={true}
        />

        <InputField
          label="Telefon (Sevkiyat)"
          onChange={handleValues}
          type="text"
          id="phoneNumber_shipment"
          name="phoneNumber_shipment"
          placeholder="0224 XXX XXXX"
          extra="mb-2"
          value={values.phoneNumber_shipment}
        />
      </div>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row">
        <InputField
          label="Telefon (Kalite)"
          onChange={handleValues}
          type="text"
          id="phoneNumber_quality"
          name="phoneNumber_quality"
          placeholder="0224 XXX XXXX"
          extra="mb-2"
          value={values.phoneNumber_quality}
        />

        <InputField
          label="Telefon 2"
          onChange={handleValues}
          type="text"
          id="phoneNumber_accountant"
          name="phoneNumber_accountant"
          placeholder="0224 XXX XXXX"
          extra="mb-2"
          value={values.phoneNumber_accountant}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <InputField
          label="Müşteri kodu"
          onChange={handleValues}
          type="text"
          id="code"
          name="code"
          placeholder="CRA10001"
          extra="mb-2"
          value={values.code}
          required={true}
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
          required={true}
        />
      </div>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row">
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
        extra="mb-10"
        value={values.address}
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <InputField
          label="Vergi No."
          onChange={handleValues}
          type="number"
          id="taxNo"
          name="taxNo"
          placeholder="Vergi No."
          extra="mb-2"
          value={values.taxNo}
          required={true}
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
          required={true}
        />
        <InputField
          label="Vergi Ofis kodu"
          onChange={handleValues}
          type="number"
          id="taxOfficeCode"
          name="taxOfficeCode"
          placeholder="Vergi Ofis kodu"
          extra="mb-2"
          value={values.taxOfficeCode}
          required={true}
        />
      </div>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row">
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
        extra="mb-8"
        value={values.definition}
      />

      <Button loading={loading} extra="mt-4" text="SAVE" />
    </form>
  );
}
