'use client';
import React, { useEffect, useMemo, useState } from 'react';
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
import { formatDateTime, useDrage } from 'utils';
import FileViewer from 'components/fileViewer';
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
  onSearch,
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
              <p className="min-w-[100px] text-sm font-bold text-gray-600 dark:text-white">
                SİRA NO.
              </p>
            ),
            cell: ({ row }) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {row.index + 1}
              </p>
            ),
          }),
          columnHelper.accessor('company_name', {
            id: 'company_name',
            header: () => (
              <p className="min-w-[200px] text-sm font-bold text-gray-600 dark:text-white">
                ŞİRKET
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('rep_name', {
            id: 'rep_name',
            header: () => (
              <p className="min-w-[100px] text-sm font-bold text-gray-600 dark:text-white">
                SORUMLU
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
                E-POSTA
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
              <p className="min-w-[200px] text-sm font-bold text-gray-600 dark:text-white">
                ADRES
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('phoneNumber', {
            id: 'phoneNumber',
            header: () => (
              <p className="min-w-[120px] text-sm font-bold text-gray-600 dark:text-white">
                TELEFON
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('postalCode', {
            id: 'postalCode',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                POSTAL KODU
              </p>
            ),
            cell: (info: any) => (
              <p className="min-w-[100px] text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('country_code', {
            id: 'country_code',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                ÜLKE KODU
              </p>
            ),
            cell: (info: any) => (
              <p className="min-w-[80px] text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('province_code', {
            id: 'province_code',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                İL KODU
              </p>
            ),
            cell: (info: any) => (
              <p className="min-w-[80px] text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('district_code', {
            id: 'district_code',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                İLÇE KODU
              </p>
            ),
            cell: (info: any) => (
              <p className="min-w-[80px] text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('code', {
            id: 'code',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                MÜŞTERİ KODU
              </p>
            ),
            cell: (info: any) => (
              <p className="min-w-[120px] text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('taxNo', {
            id: 'taxNo',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                VERGİ NO.
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('tax_Office', {
            id: 'tax_Office',
            header: () => (
              <p className="min-w-[160px] text-sm font-bold text-gray-600 dark:text-white">
                VERGİ OFİSİ
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('taxOfficeCode', {
            id: 'taxOfficeCode',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                VERGİ OFİS KODU
              </p>
            ),
            cell: (info: any) => (
              <p className="min-w-[120px] text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('cardType', {
            id: 'cardType',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                KART TÜRÜ
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
              <p className="text-center text-sm font-bold text-gray-600 dark:text-white">
                PARA BİRİMİ
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                AÇIKLAMA
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
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
        break;
      case 'stock':
        col = [
          columnHelper.accessor('id', {
            id: 'id',
            header: () => (
              <p className="min-w-[100px] text-sm font-bold uppercase text-gray-600 dark:text-white">
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
              <p className=" min-w-[90px] text-sm font-bold uppercase text-gray-600 dark:text-white">
                Ürün Kodu
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
              <p className="min-w-[120px] text-sm font-bold uppercase text-gray-600 dark:text-white">
                Ürün Adı
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('image', {
            id: 'image',
            header: () => (
              <p className="min-w-[120px] text-sm font-bold uppercase text-gray-600 dark:text-white">
                İLGİLİ DOKÜMAN
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue() ? <FileViewer file={info.getValue()} /> : null}
              </p>
            ),
          }),

          columnHelper.accessor('brand', {
            id: 'brand',
            header: () => (
              <p className="min-w-[100px] text-sm  font-bold uppercase text-gray-600 dark:text-white">
                Marka
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('product_barcode', {
            id: 'product_barcode',
            header: () => (
              <p className="min-w-[100px] text-sm font-bold uppercase text-gray-600 dark:text-white">
                Barkodu
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('inventory', {
            id: 'inventory',
            header: () => (
              <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
                Envanter
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('unit', {
            id: 'unit',
            header: () => (
              <p className="min-w-[100px] text-sm font-bold uppercase text-gray-600 dark:text-white">
                Birim
              </p>
            ),
            cell: (info: any) => (
              <p className="flex text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('current_price', {
            id: 'current_price',
            header: () => (
              <p className="min-w-[80px] text-sm font-bold uppercase text-gray-600 dark:text-white">
                Maliyet
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('curency', {
            id: 'curency',
            header: () => (
              <p className="min-w-[90px] text-sm font-bold uppercase text-gray-600 dark:text-white">
                Para Birimi
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('main_group', {
            id: 'main_group',
            header: () => (
              <p className="min-w-[120px]  text-sm font-bold uppercase text-gray-600 dark:text-white">
                Ana Grubu
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('group1', {
            id: 'group1',
            header: () => (
              <p className="min-w-[120px] text-sm font-bold uppercase text-gray-600 dark:text-white">
                Grub 1
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('group2', {
            id: 'group2',
            header: () => (
              <p className="min-w-[120px] text-sm font-bold uppercase text-gray-600 dark:text-white">
                Grub 2
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
              <p className="min-w-[140px] text-sm font-bold uppercase text-gray-600 dark:text-white">
                Açıklama
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
              <p className="min-w-[120px] text-sm font-bold uppercase text-gray-600 dark:text-white">
                Tarih
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
              <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
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
        break;
      case 'user':
        col = [
          columnHelper.accessor('id', {
            id: 'id',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                AD SOYAD
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
    <Card extra={'w-full h-full sm:overflow-auto px-6 pb-3'}>
      <header className="relative flex items-center justify-between gap-4 pt-6">
        <div className="text-md font-medium text-navy-700 dark:text-white">
          <Search
            extra="!h-[38px] md:w-[300px] md:max-w-[300px]"
            onSubmit={(val) => setGlobalFilter(val)}
            onChange={(val) => setGlobalFilter(val)}
          />
        </div>

        <Button
          text="EKLE"
          extra="!w-[140px] h-[38px] font-bold"
          onClick={onAdd}
          icon={<MdAdd className="ml-1 h-6 w-6" />}
        />
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
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id} className="min-w-[70px] p-1">
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

export default MainTable;
const columnHelper = createColumnHelper<UserObj | CustomerObj | StockObj>();
