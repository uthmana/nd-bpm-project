'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import InputField from 'components/fields/InputField';
import Button from 'components/button/button';
import Select from 'components/select/page';
import { MdOutlineArrowBack } from 'react-icons/md';
import TextArea from 'components/fields/textArea';
import { log } from 'utils';

type data = {
  username: string;
  email: string;
  password: string;
  role: string;
  status: string;
};

type CustomerObj = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  edit: string;
  delete: string;
};

type userForm = {
  onSubmit: (e: any) => void;
  data?: CustomerObj;
  title?: string;
};

export default function Customer({ onSubmit, data, title }: userForm) {
  const initialValues = data
    ? data
    : {
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        postal_code: '',
        edit: '',
        delete: '',
      };
  const [values, setValues] = useState(initialValues);

  //TODO: add input validation
  const handleValues = (event) => {
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
    log(values);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-[400px] rounded-[20px] bg-white p-5 dark:bg-opacity-10"
    >
      <NextLink
        href="/admin/customer"
        className="flex items-center gap-2 text-sm dark:text-white"
      >
        <span>
          <MdOutlineArrowBack />
        </span>
        Back to Customers
      </NextLink>

      {title ? (
        <h1 className="my-5 text-center text-[24px] font-bold dark:text-white">
          {title}
        </h1>
      ) : null}

      <InputField
        label="First Name"
        onChange={handleValues}
        type="text"
        id="first_name"
        name="first_name"
        placeholder="First Name"
        extra="mb-2"
        value={values.first_name}
      />
      <InputField
        label="Last Name"
        onChange={handleValues}
        type="text"
        id="last_name"
        name="last_name"
        placeholder="Last Name"
        extra="mb-2"
        value={values.last_name}
      />
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
      <InputField
        label="Phone"
        onChange={handleValues}
        type="text"
        id="phone"
        name="phone"
        placeholder="Phone"
        extra="mb-2"
        value={values.phone}
      />
      <InputField
        label="Postal Code"
        onChange={handleValues}
        type="text"
        id="postal_code"
        name="postal_code"
        placeholder="Postal Code"
        extra="mb-2"
        value={values.postal_code}
      />
      <TextArea
        label="Address"
        onChange={handleValues}
        id="address"
        name="address"
        placeholder="Address"
        extra="mb-2"
        value={values.address}
      />
      <Button extra="mt-4" text="SAVE" />
    </form>
  );
}
