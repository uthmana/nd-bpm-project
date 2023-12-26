'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import InputField from 'components/fields/InputField';
import Button from 'components/button/button';
import Select from 'components/select/page';
import { MdOutlineArrowBack } from 'react-icons/md';
import { log } from 'utils';

type data = {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
};

type userForm = {
  onSubmit: (e: any) => void;
  data?: data;
  title?: string;
  loading: boolean;
};

export default function User({ onSubmit, data, title, loading }: userForm) {
  const role = ['ADMIN', 'SUPER', 'NORMAL', 'TECH'];
  const status = ['ACTIVE', 'PASSIVE'];
  const [error, setError] = useState(false);

  const initialValues = data
    ? data
    : { name: '', email: '', password: '', role: 'ACTIVE', status: 'NORMAL' };
  const [values, setValues] = useState(initialValues);

  const handleValues = (event) => {
    setError(false);
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password } = values;
    if (!name || !email || !password) {
      setError(true);
      return;
    }
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[400px] rounded-[20px] bg-white p-5 dark:bg-opacity-10"
    >
      <NextLink href="/admin/users" className="flex items-center gap-2 text-sm">
        <span>
          <MdOutlineArrowBack />
        </span>
        Geri
      </NextLink>

      {title ? (
        <h1 className="my-5 text-center text-[24px] font-bold dark:text-white">
          {title}
        </h1>
      ) : null}

      {error ? (
        <p className="mb-3 w-full rounded-md bg-red-500 p-2 text-center text-sm  font-bold text-white">
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
      <Button loading={loading} extra="mt-4" text="SAVE" />
    </form>
  );
}
