'use client';
import React, { useState } from 'react';
import UserForm from 'components/forms/user';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { register } from '../../../lib/apiRequest';
import { toast } from 'react-toastify';

export default function Create() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (val) => {
    setIsSubmitting(true);
    const { status } = await register(val);
    if (status === 200) {
      router.push('/admin/users');
      toast.success('Yeni kullanıncı başarılı ile oluşturuldu.');
      setIsSubmitting(false);
      return;
    }
    toast.error('E-post zatan var, başka bir e-posta ile deneyin!.');
    alert('Email Already Exist');
    setIsSubmitting(false);
  };

  return (
    <div className="mt-12">
      <UserForm
        title="Kullanıcı Ekle"
        loading={isSubmitting}
        onSubmit={(val) => handleSubmit(val)}
      />
    </div>
  );
}
