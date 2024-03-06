'use client';

import MainTable from 'components/admin/data-tables/mainTable';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { getUsers, deleteUser } from '../../lib/apiRequest';
import { useEffect, useState } from 'react';
import { TableSkeleton } from 'components/skeleton';
import { toast } from 'react-toastify';
import Popup from 'components/popup';
import Button from 'components/button/button';

const Users = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [userId, setUserId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const getAllUsers = async () => {
    setIsloading(true);
    const { status, data } = await getUsers();
    if (status === 200) {
      setUsers(data);
    }
    setIsloading(false);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const onAdd = () => {
    router.push('/admin/users/create');
    log('onAdd');
  };

  const onComfirm = async (val) => {
    setUserId(val);
    setIsShowPopUp(true);
  };

  const onDelete = async () => {
    setIsSubmitting(true);
    const resData: any = await deleteUser(userId);

    const { status, response } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Kullanıcı silme işlemi başarısız' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      toast.success('Kullanıcı silme işlemi başarılı.');
      setIsSubmitting(false);
      setIsShowPopUp(false);
      setUsers([]);
      getAllUsers();
      return;
    }
  };

  const handleClose = (val: string) => {
    setIsShowPopUp(false);
  };

  const onEdit = (val: string) => {
    router.push(`/admin/users/create/${val}`);
  };

  return (
    <div className="mt-3 w-full">
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <MainTable
          onAdd={onAdd}
          onDelete={onComfirm}
          onEdit={onEdit}
          tableData={users}
          variant="user"
        />
      )}

      <Popup show={isShowPopUp} extra="flex flex-col gap-3 py-6 px-8">
        <h1 className="text-3xl">Kullanıcı Silme</h1>
        <p className="mb-2 text-lg">
          Bu Kullanıcıyı Silmek istediğini Emin misin ?
        </p>
        <div className="flex gap-4">
          <Button
            loading={isSubmitting}
            text="SİL"
            extra="w-[60px] bg-red-700 h-[40px]"
            onClick={onDelete}
          />
          <Button text="GERİ" extra="w-[60px] h-[40px]" onClick={handleClose} />
        </div>
      </Popup>
    </div>
  );
};

export default Users;
