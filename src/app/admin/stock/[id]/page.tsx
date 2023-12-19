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
    id: '1',
    product_name: 'Boru',
    stock_location: 'Murat',
    quantity: 3,
    price: '100',
    description: '+111 111 111 11',
    date: '12/12/2023',
    vendor: 'koçtaş',
    edit: '1',
    delete: '1',
  };

  return (
    <div className="mt-12">
      <StockForm title="Edit Stock" onSubmit={handleSubmit} data={data} />
    </div>
  );
}
