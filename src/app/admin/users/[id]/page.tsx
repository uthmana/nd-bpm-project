'use client';
import React from 'react';
import UserForm from 'components/forms/user';
import { useRouter } from 'next/navigation';
export default function Edit() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    router.push('/admin/users');
  };

  const data = {
    username: 'test',
    email: 'example@mail.com',
    password: 'Password',
    role: 'Admin',
    status: 'Passive',
  };

  return (
    <div className="mt-12">
      <UserForm onSubmit={handleSubmit} data={data} />
    </div>
  );
}
