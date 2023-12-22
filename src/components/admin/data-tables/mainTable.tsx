import React from 'react';
import Card from 'components/card';
import { MdModeEdit, MdOutlineDelete, MdAdd } from 'react-icons/md';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import Search from 'components/search/search';
import Button from 'components/button/button';
import { IoMdArrowDown, IoMdArrowUp } from 'react-icons/io';

type UserObj = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: boolean;
  date: string;
  edit: string;
  delete: string;
};

type CustomerObj = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  edit: string;
  delete: string;
};

type StockObj = {
  id: string;
  product_name: string;
  stock_location: string;
  quantity: string;
  price: string;
  description: string;
  date: string;
  vendor: string;
  edit: string;
  delete: string;
};

type MainTable = {
  tableData: UserObj | CustomerObj | StockObj | any;
  variant: string;
  onEdit: (e: any) => void;
  onDelete: (e: any) => void;
  onAdd: (e: any) => void;
};

function MainTable({
  tableData,
  onEdit,
  onDelete,
  onAdd,
  variant = 'user',
}: MainTable) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  let defaultData = tableData;

  let columns: any;
  switch (variant) {
    case 'customer':
      columns = [
        columnHelper.accessor('id', {
          id: 'id',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              ID
            </p>
          ),
          cell: (info: any) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('first_name', {
          id: 'first_name',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              FIRST NAME
            </p>
          ),
          cell: (info: any) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('last_name', {
          id: 'last_name',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              LAST NAME
            </p>
          ),
          cell: (info: any) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('email', {
          id: 'email',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              EMAIL
            </p>
          ),
          cell: (info) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('phone', {
          id: 'phone',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              PHONE
            </p>
          ),
          cell: (info) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('address', {
          id: 'address',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              ADDRESS
            </p>
          ),
          cell: (info) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('postal_code', {
          id: 'postal_code',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              POSTAL CODE
            </p>
          ),
          cell: (info) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('edit', {
          id: 'edit',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              EDIT
            </p>
          ),
          cell: (info) => (
            <button onClick={() => onEdit(info.getValue())}>
              <MdModeEdit className="h-5 w-5" />
            </button>
          ),
        }),
        columnHelper.accessor('delete', {
          id: 'delete',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              DELETE
            </p>
          ),
          cell: (info) => (
            <button onClick={() => onDelete(info.getValue())}>
              <MdOutlineDelete className="h-5 w-5" />
            </button>
          ),
        }),
      ];
      break;
    case 'stock':
      columns = [
        columnHelper.accessor('id', {
          id: 'id',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              ID
            </p>
          ),
          cell: (info: any) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('product_name', {
          id: 'product_name',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              PRODUCT NAME
            </p>
          ),
          cell: (info: any) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('stock_location', {
          id: 'stock_location',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              LOCATION
            </p>
          ),
          cell: (info: any) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('quantity', {
          id: 'quantity',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              QUANTITY
            </p>
          ),
          cell: (info) => (
            <p className="flex text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}

              {info.getValue() < 5 ? (
                <IoMdArrowDown className="h-5 w-5 text-red-500" />
              ) : (
                <IoMdArrowUp className="h-5 w-5 text-green-500" />
              )}
            </p>
          ),
        }),
        columnHelper.accessor('price', {
          id: 'price',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              PRICE
            </p>
          ),
          cell: (info) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('description', {
          id: 'description',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              DESCRIPTION
            </p>
          ),
          cell: (info) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('date', {
          id: 'date',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              DATE
            </p>
          ),
          cell: (info) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('vendor', {
          id: 'vendor',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              VENDOR
            </p>
          ),
          cell: (info) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('edit', {
          id: 'edit',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              EDIT
            </p>
          ),
          cell: (info) => (
            <button onClick={() => onEdit(info.getValue())}>
              <MdModeEdit className="h-5 w-5" />
            </button>
          ),
        }),
        columnHelper.accessor('delete', {
          id: 'delete',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              DELETE
            </p>
          ),
          cell: (info) => (
            <button onClick={() => onDelete(info.getValue())}>
              <MdOutlineDelete className="h-5 w-5" />
            </button>
          ),
        }),
      ];
      break;
    case 'user':
      columns = [
        columnHelper.accessor('id', {
          id: 'id',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              ID
            </p>
          ),
          cell: (info: any) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('name', {
          id: 'name',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              NAME
            </p>
          ),
          cell: (info: any) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('email', {
          id: 'email',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              EMAIL
            </p>
          ),
          cell: (info) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('password', {
          id: 'password',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              PASSWORD
            </p>
          ),
          cell: (info) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('role', {
          id: 'role',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              ROLE
            </p>
          ),
          cell: (info) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('status', {
          id: 'status',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              STATUS
            </p>
          ),
          cell: (info) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue() ? 'Active' : 'Passive'}
            </p>
          ),
        }),
        columnHelper.accessor('date', {
          id: 'date',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              DATE
            </p>
          ),
          cell: (info) => (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor('edit', {
          id: 'edit',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              EDIT
            </p>
          ),
          cell: (info) => (
            <button onClick={() => onEdit(info.getValue())}>
              <MdModeEdit className="h-5 w-5" />
            </button>
          ),
        }),
        columnHelper.accessor('delete', {
          id: 'delete',
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              DELETE
            </p>
          ),
          cell: (info) => (
            <button onClick={() => onDelete(info.getValue())}>
              <MdOutlineDelete className="h-5 w-5" />
            </button>
          ),
        }),
      ];
  }

  const [data, setData] = React.useState(() => [...defaultData]);
  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });
  return (
    <Card extra={'w-full h-full sm:overflow-auto px-6'}>
      <header className="relative flex items-center justify-between pt-6">
        <div className="text-md font-medium text-navy-700 dark:text-white">
          <Search
            extra="!h-[38px] w-[300px] max-w-[300px]"
            onSubmit={(val) => setGlobalFilter(val)}
            onChange={(val) => setGlobalFilter(val)}
          />
        </div>

        <Button
          text="ADD"
          extra="!w-[100px] h-[38px]"
          onClick={onAdd}
          icon={<MdAdd className="h-6 w-6" />}
        />
      </header>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b border-gray-200 pb-2 pr-4 pt-4 text-start dark:border-white/30"
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: '',
                          desc: '',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 5)
              .map((row) => {
                return (
                  <tr key={row.id} className="border-b">
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className="min-w-[100px] border-white/0 py-3  pr-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="my-4 flex w-full items-center gap-2">
          <button
            className="w-7 rounded border p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="w-7 rounded border p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            className="w-7 rounded border p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="w-7 rounded border p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
          <span className="flex items-center gap-1 text-[12px]">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="ml-4 flex items-center gap-1 text-[12px]">
            Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16 rounded border p-1"
            />
          </span>
          <select
            className="text-[12px]"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}

export default MainTable;
const columnHelper = createColumnHelper<UserObj | CustomerObj | StockObj>();
