'use client';
import React from 'react';
import StockForm from 'components/forms/stock';
import { useRouter } from 'next/navigation';

export default function Edit() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    router.push('/admin/stock');
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
      <StockForm title="Add Stock" onSubmit={handleSubmit} />
    </div>
  );
}
