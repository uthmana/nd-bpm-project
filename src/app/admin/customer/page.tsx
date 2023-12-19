'use client';

import MainTable from 'components/admin/data-tables/mainTable';
import { customerTableData } from 'variables/data-tables/tableDataMain';
import { useRouter } from 'next/navigation';

const Customers = () => {
  const router = useRouter();

  const onAdd = () => {
    router.push('/admin/customer/create');
    console.log('onAdd');
  };

  const onDelete = (val) => {
    if (confirm('Are you sur you want to DELETE this User')) {
      console.log(val);
    }
  };

  const onEdit = (val) => {
    router.push('/admin/customer/1');
    console.log(val);
  };

  return (
    <div className="mt-12 w-full">
      <MainTable
        onAdd={onAdd}
        onDelete={onDelete}
        onEdit={onEdit}
        tableData={customerTableData}
        variant="customer"
      />
    </div>
  );
};

export default Customers;
