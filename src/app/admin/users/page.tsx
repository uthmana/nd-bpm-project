'use client';

import MainTable from 'components/admin/data-tables/mainTable';
import tableDataMain from 'variables/data-tables/tableDataMain';
import { useRouter } from 'next/navigation';
const Users = () => {
  const router = useRouter();

  const onAdd = () => {
    router.push('/admin/users/create');
    console.log('onAdd');
  };

  const onDelete = (val) => {
    if (confirm('Are you sur you want to DELETE this User')) {
      console.log(val);
    }
  };

  const onEdit = (val) => {
    router.push('/admin/users/1');
    console.log(val);
  };

  return (
    <div className="mt-12 w-full">
      <MainTable
        onAdd={onAdd}
        onDelete={onDelete}
        onEdit={onEdit}
        tableData={tableDataMain}
      />
    </div>
  );
};

export default Users;
