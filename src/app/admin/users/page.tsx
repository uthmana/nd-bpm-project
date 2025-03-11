'use client';

import MainTable from 'components/admin/data-tables/mainTable';
import { useRouter } from 'next/navigation';
import { log } from 'utils';
import { getUsers, deleteUser } from '../../lib/apiRequest';
import { useEffect, useState } from 'react';
import { TableSkeleton } from 'components/skeleton';
import { toast } from 'react-toastify';
import Popup from 'components/popup';
import Button from 'components/button';
import { getResError } from 'utils/responseError';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [userId, setUserId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const getAllUsers = async () => {
    try {
      setIsloading(true);
      const { data } = await getUsers();
      setUsers(data);
      setIsloading(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsloading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const onComfirm = async (val) => {
    setUserId(val);
    setIsShowPopUp(true);
  };

  const onDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteUser(userId);
      setUsers([]);
      getAllUsers();
      setIsSubmitting(false);
      setIsShowPopUp(false);
      toast.success('Kullanıcı silme işlemi başarılı.');
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsSubmitting(false);
      setIsShowPopUp(false);
    }
  };

  const handleClose = (val: string) => {
    setIsShowPopUp(false);
  };

  return (
    <div className="mt-3 w-full">
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <MainTable
          addLink={'/admin/users/create'}
          onDelete={onComfirm}
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
