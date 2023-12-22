'use client';
import React from 'react';
import UserForm from 'components/forms/user';
import { useRouter } from 'next/navigation';
import { log } from 'utils';

export default function Create() {
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    log(e);
    router.push('/admin/users');
  };

  return (
    <div className="mt-12">
      <UserForm title="Add User" onSubmit={handleSubmit} />
    </div>
  );
}
