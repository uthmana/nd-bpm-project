'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import InputField from 'components/fields/InputField';
import Button from 'components/button/button';
import Select from 'components/select/page';
import { MdOutlineArrowBack } from 'react-icons/md';

type data = {
  username: string;
  email: string;
  password: string;
  role: string;
  status: string;
};

type userForm = {
  onSubmit: (e: any) => void;
  data?: data;
};

export default function User({ onSubmit, data }: userForm) {
  const initialValues = data
    ? data
    : { username: '', email: '', password: '', role: '', status: '' };
  const [values, setValues] = useState(initialValues);

  //TODO: add input validation
  const handleValues = (event) => {
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
    console.log(values);
  };

  const role = ['Admin', 'Super', 'Normal', 'Tech'];
  const status = ['Active', 'Passive'];

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-[400px] rounded bg-white p-5 dark:bg-opacity-10"
    >
      <NextLink href="/admin/users" className="flex items-center gap-2 text-sm">
        <span>
          <MdOutlineArrowBack />
        </span>
        Back to Users
      </NextLink>

      <h1 className="my-5 text-center text-[24px] font-bold dark:text-white">
        Create User
      </h1>
      <InputField
        label="Username"
        onChange={handleValues}
        type="text"
        id="username"
        name="username"
        placeholder="Username"
        extra="mb-2"
        value={values.username}
      />
      <InputField
        label="Email"
        onChange={handleValues}
        type="email"
        id="email"
        name="email"
        placeholder="Email"
        extra="mb-2"
        value={values.email}
      />
      <InputField
        label="Password"
        onChange={handleValues}
        type="text"
        id="password"
        name="password"
        placeholder="Password"
        extra="mb-2"
        value={values.password}
      />
      <Select extra="mb-2" label="Role" onChange={handleValues} name="role">
        {role.map((item, idx) => {
          return (
            <option
              value={item}
              key={idx}
              selected={data && data?.role === item}
            >
              {item}
            </option>
          );
        })}
      </Select>

      <Select extra="mb-2" label="Status" onChange={handleValues} name="status">
        {status.map((item, idx) => {
          return (
            <option
              value={item}
              key={idx}
              selected={data && data?.status === item}
            >
              {item}
            </option>
          );
        })}
      </Select>
      <Button extra="mt-4" text="SAVE" />
    </form>
  );
}
