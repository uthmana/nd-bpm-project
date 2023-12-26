'use client';
import React, { useEffect, useState } from 'react';
import UserForm from 'components/forms/user';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { useParams } from 'next/navigation';
import { getUserById, updateUser } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import { UserFormSkeleton } from 'components/skeleton';

export default function Edit() {
  const router = useRouter();
  const queryParams = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const getSingleUser = async () => {
      setIsSubmitting(true);
      const { status, data } = await getUserById(queryParams.id);
      if (status === 200) {
        setUser(data);
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
      //TODO: handle error
    };
    if (queryParams.id) {
      getSingleUser();
    }
  }, [queryParams?.id]);

  const handleSubmit = async (val) => {
    setIsSubmitting(true);
    if (!val) return;
    const { status, data } = await updateUser({ ...val, id: queryParams?.id });
    if (status === 200) {
      toast.success('Kullanıcı güncelleme başarılı.');
      router.push('/admin/users');
      setIsSubmitting(true);
      return;
    }
    setIsSubmitting(true);
    toast.error('Kullanıcı güncelleme başarısız.');
  };

  return (
    <div className="mt-12">
      {user.length === 0 ? (
        <div className="mx-auto max-w-[400px]">
          <UserFormSkeleton />
        </div>
      ) : (
        <UserForm
          title="Kullanıcı Düzenle"
          loading={isSubmitting}
          onSubmit={(val) => handleSubmit(val)}
          data={user as any}
        />
      )}
    </div>
  );
}
