'use client';
import React, { useEffect, useState } from 'react';
import UserForm from 'components/forms/user';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { useParams } from 'next/navigation';
import { getUserById, updateUser } from 'app/lib/apiRequest';
import { toast } from 'react-toastify';
import { FormSkeleton } from 'components/skeleton';
import Card from 'components/card';
import { getResError } from 'utils/responseError';

export default function Edit() {
  const router = useRouter();
  const queryParams = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const getSingleUser = async () => {
      try {
        setIsloading(true);
        const { data } = await getUserById(queryParams.id);
        setUser(data);
        setIsloading(false);
        setIsSubmitting(false);
      } catch (error) {
        const message = getResError(error?.message);
        toast.error(`${message}`);
        setIsloading(false);
        setIsSubmitting(false);
      }
    };
    if (queryParams.id) {
      getSingleUser();
    }
  }, [queryParams?.id]);

  const handleSubmit = async (val) => {
    if (!val) return;
    try {
      setIsSubmitting(true);
      await updateUser({ ...val, id: queryParams?.id });

      toast.success('Kullanıcı güncelleme başarılı.');
      router.push('/admin/users');
      setIsSubmitting(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <Card extra="mt-12 mx-auto mt-4 max-w-[780px] rounded-2xl px-8 py-10 bg-white dark:bg-[#111c44] dark:text-white">
      {isLoading ? (
        <div className="w-full">
          <FormSkeleton />
        </div>
      ) : (
        <UserForm
          title="Kullanıcı Düzenle"
          loading={isSubmitting}
          onSubmit={(val) => handleSubmit(val)}
          data={user as any}
        />
      )}
    </Card>
  );
}
