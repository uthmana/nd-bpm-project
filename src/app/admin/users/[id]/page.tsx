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
  const [isLoading, setIsloading] = useState(false);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const getSingleUser = async () => {
      setIsloading(true);
      const { status, data } = await getUserById(queryParams.id);
      if (status === 200) {
        setUser(data);
        setIsloading(false);
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
    const resData: any = await updateUser({ ...val, id: queryParams?.id });
    const { status, response } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Kullanıcı güncelleme başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }
    if (status === 200) {
      toast.success('Kullanıcı güncelleme başarılı.');
      router.push('/admin/users');
      setIsSubmitting(false);
      return;
    }
  };

  return (
    <div className="mt-12">
      {isLoading ? (
        <div className="mx-auto max-w-[700px]">
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
