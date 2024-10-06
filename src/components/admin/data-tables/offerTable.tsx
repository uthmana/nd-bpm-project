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
  MdAdd,
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
import {
  formatDateTime,
  useDrage,
  formatNumberLocale,
  formatCurrency,
} from 'utils';
import { OfferObj, OfferTypeTable } from 'app/localTypes/table-types';
import TablePagination from './tablePagination';

function OfferTable({
  tableData,
  onEdit,
  onDelete,
  onAdd,
  onControl,
  variant = 'NORMAL',
  searchValue,
}: OfferTypeTable) {
  let defaultData = tableData;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [search, setSearch] = useState(searchValue || '');
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useDrage();

  const columns = useMemo(() => {
    const offerStatus = {
      PENDING: 'Beklemede',
      SENT: 'Gönderildi',
      ACCEPTED: 'Kabul edildi',
      REJECTED: 'Ret',
    };
    const statusbgColor = (status: string) => {
      if (status === 'SENT') {
        return (
          <MdCheckCircle className="me-1 text-green-500 dark:text-green-300" />
        );
      }
      if (status === 'REJECTED') {
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
          <p className="min-w-[60px] text-sm font-bold text-gray-600 dark:text-white">
            SİRA NO.
          </p>
        ),
        cell: ({ row }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {(row.index + 1).toString()}
          </p>
        ),
      }),
      // columnHelper.accessor('OfferType', {
      //   id: 'OfferType',
      //   header: () => (
      //     <p className="min-w-[100px] text-sm font-bold uppercase text-gray-600 dark:text-white">
      //       TEKLİF
      //     </p>
      //   ),
      //   cell: (info: any) => (
      //     <p className="text-sm font-bold text-navy-700 dark:text-white">
      //       {info.getValue()}
      //     </p>
      //   ),
      // }),
      columnHelper.accessor('customerName', {
        id: 'customerName',
        header: () => (
          <p className="min-w-[200px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            MÜŞTERİ
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
          <p className="min-w-[180px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            UYGULAMA
          </p>
        ),
        cell: (info: any) => (
          <p
            className="text-sm font-bold text-navy-700 dark:text-white"
            dangerouslySetInnerHTML={{ __html: info.getValue() }}
          ></p>
        ),
      }),
      columnHelper.accessor('startDate', {
        id: 'startDate',
        header: () => (
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
            BAŞLANGIÇ
          </p>
        ),
        cell: (info: any) => (
          <p className="whitespace-nowrap  break-keep text-sm font-bold text-navy-700 dark:text-white">
            {formatDateTime(info.getValue())}
          </p>
        ),
      }),
      columnHelper.accessor('endDate', {
        id: 'endDate',
        header: () => (
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
            BİTİŞ
          </p>
        ),
        cell: (info: any) => (
          <p className="whitespace-nowrap  break-keep text-sm font-bold text-navy-700 dark:text-white">
            {formatDateTime(info.getValue())}
          </p>
        ),
      }),
      columnHelper.accessor('totalAmount', {
        id: 'totalAmount',
        header: () => (
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
            TOPLAM
          </p>
        ),
        cell: (info: any) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {formatCurrency(info.getValue())}
          </p>
        ),
      }),
      columnHelper.accessor('currency', {
        id: 'currency',
        header: () => (
          <p className="min-w-[80px]  whitespace-nowrap break-keep  text-sm font-bold uppercase text-gray-600 dark:text-white">
            PARA BIRIMI
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
          <p className="min-w-[170px]  whitespace-nowrap break-keep  text-sm font-bold uppercase text-gray-600 dark:text-white">
            E-POSTA
          </p>
        ),
        cell: (info: any) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: () => (
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
            DURUM
          </p>
        ),
        cell: (info: any) => (
          <div className="flex min-w-[100px] items-center">
            {statusbgColor(info.getValue())}
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {offerStatus[info.getValue()]}
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

        <Button
          text="Teklif Oluştur"
          extra="!w-fit px-4 h-[38px] font-bold mb-3"
          onClick={onAdd}
          icon={<MdAdd className="ml-1 h-6 w-6" />}
        />
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
                          <td key={cell.id + idx} className="p-2">
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
    </>
  );
}

export default OfferTable;
const columnHelper = createColumnHelper<OfferObj>();
