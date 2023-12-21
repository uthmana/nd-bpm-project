'use client';

import MainTable from 'components/admin/data-tables/mainTable';
import { stockTableData } from 'variables/data-tables/tableDataMain';
import { useRouter } from 'next/navigation';

const Stock = () => {
  const router = useRouter();

  const onAdd = () => {
    router.push('/admin/stock/create');
    console.log('onAdd');
  };

  const onDelete = (val) => {
    if (confirm('Are you sur you want to DELETE this User')) {
      console.log(val);
    }
  };

  const onEdit = (val) => {
    router.push('/admin/stock/1');
    console.log(val);
  };

  return (
    <div className="mt-3 w-full">
      <MainTable
        onAdd={onAdd}
        onDelete={onDelete}
        onEdit={onEdit}
        tableData={stockTableData}
        variant="stock"
      />
    </div>
  );
};

export default Stock;
