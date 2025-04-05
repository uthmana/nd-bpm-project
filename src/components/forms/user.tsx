'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import InputField from 'components/fields/InputField';
import Button from 'components/button';
import Select from 'components/select';
import { MdOutlineArrowBack } from 'react-icons/md';
import { log } from 'utils';

type data = {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  role: string;
  status: string;
};

type userForm = {
  onSubmit: (e: any) => void;
  data?: data;
  title?: string;
  loading: boolean;
};

export default function User(props: userForm) {
  const { onSubmit, data, title, loading } = props;

  const role = ['ADMIN', 'SUPER', 'NORMAL', 'TECH'];
  const status = ['ACTIVE', 'PASSIVE'];
  const [error, setError] = useState(false);

  const initialValues = data
    ? data
    : {
        name: '',
        email: '',
        contactNumber: '',
        password: '',
        role: 'NORMAL',
        status: 'ACTIVE',
      };
  const [values, setValues] = useState(initialValues);

  const handleValues = (event) => {
    setError(false);
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password } = values;

    if (!name || !email) {
      setError(true);
      return;
    }
    if (!data && !password) {
      setError(true);
      return;
    }
    log(values);
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <NextLink
        href="/admin/users"
        className="flex items-center gap-2 text-sm dark:text-white"
      >
        <span>
          <MdOutlineArrowBack />
        </span>
        Geri
      </NextLink>

      {title ? (
        <h1 className="dark:white mb-8 text-center text-2xl font-bold md:text-4xl">
          {title}
        </h1>
      ) : null}

      {error ? (
        <p className="mb-3 w-full rounded-md bg-red-300 p-2 text-center text-sm  font-bold text-white">
          Lütfen boş alanları doldurun !
        </p>
      ) : null}

      <InputField
        label="Ad Soyad"
        onChange={handleValues}
        type="text"
        id="name"
        name="name"
        placeholder="Ad Soyad"
        extra="mb-2"
        value={values.name}
        required={true}
      />
      <InputField
        label="Telefon"
        onChange={handleValues}
        type="phone"
        id="phone"
        name="contactNumber"
        placeholder="(5XX) XXX XX XX"
        extra="mb-2"
        value={values.contactNumber}
        required={true}
      />

      <InputField
        label="E-posta"
        onChange={handleValues}
        type="email"
        id="email"
        name="email"
        placeholder="Email"
        extra="mb-2"
        value={values.email}
        required={true}
      />
      <InputField
        label="Şifre"
        onChange={handleValues}
        type="text"
        id="password"
        name="password"
        placeholder="Şifre"
        extra="mb-2"
        value={values.password}
      />
      <Select extra="mb-2" label="Rol" onChange={handleValues} name="role">
        {role.map((item, idx) => {
          return (
            <option
              value={item}
              key={idx}
              selected={data ? data?.role === item : idx === 0}
            >
              {item}
            </option>
          );
        })}
      </Select>

      <Select extra="mb-2" label="Durum" onChange={handleValues} name="status">
        {status.map((item, idx) => {
          return (
            <option
              value={item}
              key={idx}
              selected={data ? data?.status === item : idx === 0}
            >
              {item}
            </option>
          );
        })}
      </Select>
      <Button loading={loading} extra="mt-8" text="KAYDET" />
    </form>
  );
}
