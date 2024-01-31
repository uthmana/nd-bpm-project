import React, { useMemo, useState } from 'react';
import Card from 'components/card';
import {
  MdModeEdit,
  MdOutlineDelete,
  MdAdd,
  MdCheckCircle,
  MdCancel,
  MdOutlineError,
  MdPreview,
} from 'react-icons/md';
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
import { formatDateTime, useDrage } from 'utils';
import FileViewer from 'components/fileViewer';
import { InvoiceObj, InvoiceTable } from '../../../app/localTypes/table-types';
import TablePagination from './tablePagination';

function InvoiceTable({
  tableData,
  onEdit,
  onDelete,
  onAdd,
  onControl,
  variant = 'NORMAL',
  searchValue,
}: InvoiceTable) {
  let defaultData = tableData;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [search, setSearch] = useState(searchValue || '');
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useDrage();

  const columns = useMemo(() => {
    const invoiceStatus = {
      ACTIVE: 'Aktif',
      PAID: 'Ödendi',
      NOT_PAID: 'Ödenmedi',
    };
    const statusbgColor = (status: string) => {
      if (status === 'PAID') {
        return (
          <MdCheckCircle className="me-1 text-green-500 dark:text-green-300" />
        );
      }
      if (status === 'NOT_PAID') {
        return <MdCancel className="me-1 text-red-500 dark:text-red-300" />;
      }
      return (
        <MdOutlineError className="me-1 text-amber-500 dark:text-amber-300" />
      );
    };

    return [
      columnHelper.accessor('id', {
        id: 'id',
        header: () => (
          <p className="min-w-[80px] text-sm font-bold text-gray-600 dark:text-white">
            SİRA NO.
          </p>
        ),
        cell: ({ row }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {(row.index + 1).toString()}
          </p>
        ),
      }),
      columnHelper.accessor('barcode', {
        id: 'barcode',
        header: () => (
          <p className="min-w-[100px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            Takip Kodu
          </p>
        ),
        cell: (info: any) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('customerName', {
        id: 'customerName',
        header: () => (
          <p className="min-w-[200px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            Müşteri
          </p>
        ),
        cell: (info: any) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('products', {
        id: 'products',
        header: () => (
          <p className="min-w-[300px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            Ürünleri
          </p>
        ),
        cell: (info: any) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('createdAt', {
        id: 'createdAt',
        header: () => (
          <p className="min-w-[130px]  text-sm font-bold uppercase text-gray-600 dark:text-white">
            Oluşturma Tarihi
          </p>
        ),
        cell: (info: any) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {formatDateTime(info.getValue())}
          </p>
        ),
      }),
      columnHelper.accessor('invoiceDate', {
        id: 'invoiceDate',
        header: () => (
          <p className="min-w-[120px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            İrsalye Tarihi
          </p>
        ),
        cell: (info: any) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {formatDateTime(info.getValue())}
          </p>
        ),
      }),
      columnHelper.accessor('address', {
        id: 'address',
        header: () => (
          <p className="min-w-[160px]  text-sm font-bold uppercase text-gray-600 dark:text-white">
            Adres
          </p>
        ),
        cell: (info: any) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),

      columnHelper.accessor('description', {
        id: 'description',
        header: () => (
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
            Açıklama
          </p>
        ),
        cell: (info: any) => (
          <p className="min-w-[100px] text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: () => (
          <p className="min-w-[130px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            KONTROL DURUMU
          </p>
        ),
        cell: (info: any) => (
          <div className="flex items-center">
            {statusbgColor(info.getValue())}
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {invoiceStatus[info.getValue()]}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor('id', {
        id: 'id',
        header: () => (
          <p className="min-w-[80px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            AKSİYON
          </p>
        ),
        cell: (info: any) => {
          const isAccept = info.row.original.status === 'PAID';
          return (
            <div className="flex gap-2">
              <button
                className="rounded-md bg-blue-600 px-2 py-1 hover:bg-blue-700"
                onClick={() => onControl(info.getValue())}
              >
                <MdPreview className="h-5 w-5 text-white" />
              </button>
              <button
                className={`rounded-md bg-green-600 px-2 py-1 hover:bg-green-700 ${
                  isAccept ? 'disabled:opacity-25' : ''
                }`}
                onClick={() => onEdit(info.getValue())}
                disabled={isAccept}
              >
                <MdModeEdit className="h-5 w-5 text-white" />
              </button>
              <button
                className={`rounded-md bg-red-600 px-2 py-1 hover:bg-red-700 ${
                  isAccept ? 'disabled:opacity-25' : ''
                }`}
                onClick={() => onDelete(info.getValue())}
                disabled={isAccept}
              >
                <MdOutlineDelete className="h-5 w-5 text-white" />
              </button>
            </div>
          );
        },
      }),
    ];
  }, []);

  const [data, setData] = useState(() => [...defaultData]);
  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: 10,
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
    <Card extra={'w-full h-full sm:overflow-auto px-6 pb-3'}>
      <header className="relative flex items-center justify-between gap-4 pt-6">
        <div className="text-md font-medium text-navy-700 dark:text-white">
          <Search
            extra="!h-[38px] md:w-[300px] md:max-w-[300px]"
            onSubmit={(val) => setGlobalFilter(val)}
            onChange={(val) => setGlobalFilter(val)}
            value={search}
          />
        </div>

        {variant === 'NORMAL' || variant === 'ADMIN' ? (
          <Button
            text="İrsalye Oluştur"
            extra="!w-fit px-4 h-[38px] font-bold"
            onClick={onAdd}
            icon={<MdAdd className="ml-1 h-6 w-6" />}
          />
        ) : null}
      </header>

      <div
        className="custom-scrollbar--hidden mt-8 overflow-x-scroll"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
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
                      className="cursor-pointer border-b border-gray-400 pb-2 pr-4 pt-4 text-start dark:border-white/30"
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
              .rows.slice()
              .map((row) => {
                return (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-lightPrimary dark:border-gray-900 dark:hover:bg-navy-700"
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id} className="min-w-[80px] p-1">
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
        <TablePagination table={table} />
      </div>
    </Card>
  );
}

export default InvoiceTable;
const columnHelper = createColumnHelper<InvoiceObj>();
