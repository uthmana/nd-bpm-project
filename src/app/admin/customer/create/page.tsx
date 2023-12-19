'use client';
import React from 'react';
import CustomerForm from 'components/forms/customer';
import { useRouter } from 'next/navigation';

export default function Create() {
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    router.push('/admin/customer');
  };

  return (
    <div className="mt-12">
      <CustomerForm title="Add Customer" onSubmit={handleSubmit} />
    </div>
  );
}
