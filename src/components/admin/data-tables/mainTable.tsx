'use client';
import React, { useMemo, useState } from 'react';
import Card from 'components/card';
import {
  MdModeEdit,
  MdOutlineDelete,
  MdAdd,
  MdOutlineKeyboardDoubleArrowDown,
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
import TablePagination from './tablePagination';
import {
  PrimaryTable,
  StockObj,
  CustomerObj,
  UserObj,
} from '../../../app/localTypes/table-types';


function MainTable({
  tableData,
  onEdit,
  onDelete,
  onAdd,
  variant = 'user',
}: PrimaryTable) {
  let defaultData = tableData;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useDrage();

  const columns = useMemo(() => {
    let col: any;
    switch (variant) {
      case 'customer':
        col = [
          columnHelper.accessor('id', {
            id: 'id',
            header: () => (
              <p className="group relative max-w-fit whitespace-nowrap  break-keep text-sm font-bold text-gray-600 dark:text-white">
                SİRA NO.
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: ({ row }) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {row.index + 1}
              </p>
            ),
          }),
          columnHelper.accessor('code', {
            id: 'code',
            header: () => (
              <p className="group relative whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                MÜŞTERİ KODU
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p className="min-w-[120px] whitespace-nowrap break-keep text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('company_name', {
            id: 'company_name',
            header: () => (
              <p className="group relative min-w-[200px] text-sm font-bold text-gray-600 dark:text-white">
                ŞİRKET
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
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
          columnHelper.accessor('rep_name', {
            id: 'rep_name',
            header: () => (
              <p className="group relative min-w-[100px] text-sm font-bold text-gray-600 dark:text-white">
                SORUMLU
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p
                title={info.getValue()}
                className="whitespace-nowrap break-keep text-sm font-bold text-navy-700 dark:text-white"
              >
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('email', {
            id: 'email',
            header: () => (
              <p className="group relative whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                E-POSTA
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('address', {
            id: 'address',
            header: () => (
              <p className="group relative min-w-[200px] text-sm font-bold text-gray-600 dark:text-white">
                ADRES
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
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
          columnHelper.accessor('phoneNumber', {
            id: 'phoneNumber',
            header: () => (
              <p className="group relative min-w-[120px] text-sm font-bold text-gray-600 dark:text-white">
                TELEFON
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p className="whitespace-nowrap break-keep text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('postalCode', {
            id: 'postalCode',
            header: () => (
              <p className="group relative whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                POSTAL KODU
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p className="whitespace-nowrap break-keep text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('country_code', {
            id: 'country_code',
            header: () => (
              <p className="group relative whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                ÜLKE KODU
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p className="min-w-[80px] whitespace-nowrap break-keep text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('province_code', {
            id: 'province_code',
            header: () => (
              <p className="group relative whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                İL KODU
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p className="min-w-[80px] whitespace-nowrap break-keep text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('district_code', {
            id: 'district_code',
            header: () => (
              <p className="group relative whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                İLÇE KODU
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p className="min-w-[80px] whitespace-nowrap break-keep text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('taxNo', {
            id: 'taxNo',
            header: () => (
              <p className="group relative whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                VERGİ NO.
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p className="whitespace-nowrap break-keep text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('tax_Office', {
            id: 'tax_Office',
            header: () => (
              <p className="group relative whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                VERGİ OFİSİ
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
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
          columnHelper.accessor('taxOfficeCode', {
            id: 'taxOfficeCode',
            header: () => (
              <p className="group relative whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                VERGİ OFİS KODU
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p className="whitespace-nowrap break-keep text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('cardType', {
            id: 'cardType',
            header: () => (
              <p className="group relative min-w-[80px] whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                KART TÜRÜ
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('currency', {
            id: 'currency',
            header: () => (
              <p className="group relative whitespace-nowrap break-keep text-center text-sm font-bold text-gray-600 dark:text-white">
                PARA BİRİMİ
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p className="min-w-[90px] text-center text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('definition', {
            id: 'definition',
            header: () => (
              <p className="group relative text-sm font-bold text-gray-600 dark:text-white">
                AÇIKLAMA
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
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

          columnHelper.accessor('id', {
            id: 'id',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                DÜZENLE
              </p>
            ),
            cell: (info) => (
              <div className="flex gap-1">
                <button
                  className="rounded-md bg-green-600 px-2 py-1 hover:bg-green-700"
                  onClick={() => onEdit(info.getValue())}
                >
                  <MdModeEdit className="h-5 w-5 text-white" />
                </button>
                <button
                  className="rounded-md bg-red-600  px-2 py-1 hover:bg-red-700"
                  onClick={() => onDelete(info.getValue())}
                >
                  <MdOutlineDelete className="h-5 w-5 text-white" />
                </button>
              </div>
            ),
          }),
        ];
        break;
      case 'stock':
        col = [
          columnHelper.accessor('id', {
            id: 'id',
            header: () => (
              <p className="min-w-[70px] whitespace-nowrap break-keep text-sm font-bold uppercase text-gray-600 dark:text-white">
                Sira No.
              </p>
            ),
            cell: ({ row }) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {row.index + 1}
              </p>
            ),
          }),
          columnHelper.accessor('product_code', {
            id: 'product_code',
            header: () => (
              <p className="group relative min-w-[100px] whitespace-nowrap break-keep text-sm font-bold uppercase text-gray-600 dark:text-white">
                Ürün Kodu{' '}
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p className="min-w-[180px] text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('product_barcode', {
            id: 'product_barcode',
            header: () => (
              <p className="group relative min-w-[180px] text-sm font-bold uppercase text-gray-600 dark:text-white">
                Barkodu{' '}
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p className="max-w-[180px] text-sm font-bold  text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('productBatchNumber', {
            id: 'productBatchNumber',
            header: () => (
              <p className="group relative min-w-[100px] whitespace-nowrap break-keep text-sm font-bold uppercase text-gray-600 dark:text-white">
                Parti No.{' '}
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p className="min-w-[180px] text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('customerName', {
            id: 'customerName',
            header: () => (
              <p className="group relative text-sm font-bold uppercase text-gray-600 dark:text-white">
                MÜŞTERİ
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p
                title={info.getValue()}
                className="line-clamp-1 min-w-[220px] max-w-[260px] text-sm font-bold text-navy-700 dark:text-white"
              >
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('product_name', {
            id: 'product_name',
            header: () => (
              <p className="group relative min-w-[160px] whitespace-nowrap break-keep text-sm font-bold uppercase text-gray-600 dark:text-white">
                Ürün Adı{' '}
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
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
          columnHelper.accessor('inventory', {
            id: 'inventory',
            header: () => (
              <p className="group relative text-sm font-bold uppercase text-gray-600 dark:text-white">
                MİKTAR{' '}
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('date', {
            id: 'date',
            header: () => (
              <p className="group relative min-w-[120px] text-sm font-bold uppercase text-gray-600 dark:text-white">
                Tarih
                <span className="absolute right-0 top-0 hidden group-hover:block">
                  <MdOutlineKeyboardDoubleArrowDown />
                </span>
              </p>
            ),
            cell: (info: any) => (
              <p
                title={formatDateTime(info.getValue())}
                className="line-clamp-1 text-sm font-bold text-navy-700 dark:text-white"
              >
                {formatDateTime(info.getValue())}
              </p>
            ),
          }),
          columnHelper.accessor('id', {
            id: 'id',
            header: () => (
              <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
                DÜZENLE
              </p>
            ),
            cell: (info) => (
              <div className="flex gap-1">
                <button
                  className="rounded-md bg-green-600 px-2 py-1 hover:bg-green-700"
                  onClick={() => onEdit(info.getValue())}
                >
                  <MdModeEdit className="h-5 w-5 text-white" />
                </button>
                <button
                  className="rounded-md bg-red-600  px-2 py-1 hover:bg-red-700"
                  onClick={() => onDelete(info.getValue())}
                >
                  <MdOutlineDelete className="h-5 w-5 text-white" />
                </button>
              </div>
            ),
          }),
        ];
        break;
      case 'user':
        col = [
          columnHelper.accessor('id', {
            id: 'id',
            header: () => (
              <p className="whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                Sira No.
              </p>
            ),
            cell: ({ row }) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {row.index + 1}
              </p>
            ),
          }),
          columnHelper.accessor('name', {
            id: 'name',
            header: () => (
              <p className="whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                AD SOYAD
              </p>
            ),
            cell: (info: any) => (
              <p className="whitespace-nowrap text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('email', {
            id: 'email',
            header: () => (
              <p className="whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                E-POSTA
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('role', {
            id: 'role',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                ROLÜ
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                DURUM
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                TARIH
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {formatDateTime(info.getValue())}
              </p>
            ),
          }),
          columnHelper.accessor('id', {
            id: 'id',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                DÜZENLE
              </p>
            ),
            cell: (info) => (
              <div className="flex gap-2">
                <button
                  className="rounded-md bg-green-600 px-2 py-1 hover:bg-green-700"
                  onClick={() => onEdit(info.getValue())}
                >
                  <MdModeEdit className="h-5 w-5 text-white" />
                </button>
                <button
                  className="rounded-md bg-red-600  px-2 py-1 hover:bg-red-700"
                  onClick={() => onDelete(info.getValue())}
                >
                  <MdOutlineDelete className="h-5 w-5 text-white" />
                </button>
              </div>
            ),
          }),
        ];
    }
    return col;
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
          text="EKLE"
          extra="!w-[140px] h-[38px] font-bold mb-3"
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
                        className="cursor-pointer border-b border-gray-400 px-1 text-start dark:border-white/30"
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
                      // onDoubleClick={() => onDoubleClick(row.original.id)}
                    >
                      {row.getVisibleCells().map((cell, indx) => {
                        return (
                          <td key={cell.id + indx} className="p-2">
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

export default MainTable;
const columnHelper = createColumnHelper<UserObj | CustomerObj | StockObj>();
