'use client';
import React from 'react';
import CustomerForm from 'components/forms/customer';
import { useRouter } from 'next/navigation';

export default function Edit() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    router.push('/admin/customer');
  };

  const data = {
    id: '3',
    first_name: 'Erdem',
    last_name: 'Murat',
    email: 'example@mail.com',
    phone: '+333 333 33 33',
    address: 'Istanbul',
    postal_code: '32202',
    edit: '2',
    delete: '2',
  };

  return (
    <div className="mt-12">
      <CustomerForm title="Edit Customer" onSubmit={handleSubmit} data={data} />
    </div>
  );
}
