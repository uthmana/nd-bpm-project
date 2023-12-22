'use client';

import MainTable from 'components/admin/data-tables/mainTable';
import { userTableData } from 'variables/data-tables/tableDataMain';
import { useRouter } from 'next/navigation';
import { log } from 'utils';

const Users = () => {
  const router = useRouter();

  const onAdd = () => {
    router.push('/admin/users/create');
    log('onAdd');
  };

  const onDelete = (val) => {
    if (confirm('Are you sur you want to DELETE this User')) {
      log(val);
    }
  };

  const onEdit = (val) => {
    router.push('/admin/users/1');
    log(val);
  };

  return (
    <div className="mt-3 w-full">
      <MainTable
        onAdd={onAdd}
        onDelete={onDelete}
        onEdit={onEdit}
        tableData={userTableData}
        variant="user"
      />
    </div>
  );
};

export default Users;
