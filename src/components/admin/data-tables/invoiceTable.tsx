/* eslint-disable react/display-name */
import React, { useMemo, useState } from 'react';
import Card from 'components/card';
import {
  MdModeEdit,
  MdOutlineDelete,
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
import { formatDateTime, useDrage, formatNumberLocale } from 'utils';
import { InvoiceObj, InvoiceTypeTable } from 'app/localTypes/table-types';
import TablePagination from './tablePagination';
import TableEmpty from './tableEmpty';

function InvoiceTable({
  tableData,
  onEdit,
  onDelete,
  onAdd,
  onControl,
  variant = 'NORMAL',
  searchValue,
}: InvoiceTypeTable) {
  let defaultData = tableData;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [search, setSearch] = useState(searchValue || '');
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useDrage();

  const columns = useMemo(() => {
    const invoiceStatus = {
      PENDING: 'Beklemede',
      ACTIVE: 'Aktif',
      PAID: 'Tamamlandı',
      NOT_PAID: 'Tamamlanmadı',
    };
    const statusbgColor = (status: string) => {
      if (status === 'ACTIVE') {
        return (
          <MdCheckCircle className="me-1 text-blue-700 dark:text-blue-500" />
        );
      }
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
          <p className="whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
            #{' '}
          </p>
        ),
        cell: ({ row }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {(row.index + 1).toString()}
          </p>
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
            <div className="flex gap-1">
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
      columnHelper.accessor('status', {
        id: 'status',
        header: () => (
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
            DURUM
          </p>
        ),
        cell: (info: any) => (
          <div className="flex min-w-[90px] items-center">
            {statusbgColor(info.getValue())}
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {invoiceStatus[info.getValue()]}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor('logoId', {
        id: 'logoId',
        header: () => (
          <p className="min-w-fit text-sm font-bold uppercase text-gray-600 dark:text-white">
            LogoID
          </p>
        ),
        cell: (info: any) => (
          <p className="min-w-fit whitespace-nowrap  break-keep text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('barcode', {
        id: 'barcode',
        header: () => (
          <p className="min-w-fit text-sm font-bold uppercase text-gray-600 dark:text-white">
            BARKODU
          </p>
        ),
        cell: (info: any) => (
          <p className="min-w-fit whitespace-nowrap  break-keep text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('customerName', {
        id: 'customerName',
        header: () => (
          <p className="min-w-[200px]  text-sm font-bold uppercase text-gray-600 dark:text-white">
            Müşteri
          </p>
        ),
        cell: (info: any) => (
          <p
            title={info.getValue()}
            className="line-clamp-1 text-sm font-bold text-navy-700 dark:text-white"
          >
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('products', {
        id: 'products',
        header: () => (
          <p className="whitespace-nowrap text-sm font-bold uppercase text-gray-600 dark:text-white">
            ÜRÜN SAYISI
          </p>
        ),
        cell: (info: any) => (
          <p
            title={info.getValue()}
            className="line-clamp-1 min-w-[90px] text-sm font-bold text-navy-700 dark:text-white"
          >
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('createdAt', {
        id: 'createdAt',
        header: () => (
          <p className="min-w-[130px] whitespace-nowrap break-keep  text-sm font-bold uppercase text-gray-600 dark:text-white">
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
          <p className="min-w-[120px] whitespace-nowrap break-keep text-sm font-bold uppercase text-gray-600 dark:text-white">
            Sevkiyat Tarihi
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
          <p className="min-w-[200px]  text-sm font-bold uppercase text-gray-600 dark:text-white">
            Adres
          </p>
        ),
        cell: (info: any) => (
          <p
            title={info.getValue()}
            className="line-clamp-1 text-sm font-bold text-navy-700 dark:text-white"
          >
            {info.getValue()}
          </p>
        ),
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
    <>
      <header className="relative mb-7 flex items-center justify-between gap-4 border-b">
        <div className="text-md w-[60%] font-medium text-navy-700 dark:text-white">
          <Search
            extra="w-full"
            onSubmit={(val) => setGlobalFilter(val)}
            onChange={(val) => setGlobalFilter(val)}
          />
        </div>
      </header>

      <Card extra={'w-full h-full sm:overflow-auto px-6 pb-3'}>
        <div
          className="custom-scrollbar--hidden mt-9 overflow-x-scroll"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="!border-px !border-gray-400"
                >
                  {headerGroup.headers.map((header, idx) => {
                    return (
                      <th
                        key={header.id + idx}
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
                      {row.getVisibleCells().map((cell, idx) => {
                        return (
                          <td key={cell.id + idx} className="py-2 pr-2">
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
          {data.length === 0 ? <TableEmpty /> : null}
          <TablePagination table={table} />
        </div>
      </Card>
    </>
  );
}

export default InvoiceTable;
const columnHelper = createColumnHelper<InvoiceObj>();
