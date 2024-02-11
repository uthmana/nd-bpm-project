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
    const resData: any = await register(val);
    const { status, response } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Yeni kullanıncı ekleme işlemi başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }
    if (status === 200) {
      router.push('/admin/users');
      toast.success('Yeni kullanıncı ekleme işlemi başarılı.');
      setIsSubmitting(false);
      return;
    }
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
