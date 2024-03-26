import React, { useMemo, useState } from 'react';
import Card from 'components/card';
import { useDrage } from 'utils';
import {
  ProcessObj,
  ProcessTypeTable,
  PrimaryTable,
  CustomerObj,
} from 'app/localTypes/table-types';

import { MdCheckCircle, MdCancel, MdOutlineError } from 'react-icons/md';
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

function MiniTable({
  tableData,
  variant = 'NORMAL',
  title,
}: ProcessTypeTable | PrimaryTable) {
  let defaultData = tableData;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useDrage();

  const columns = useMemo(() => {
    let col: any;

    const entryStatus = {
      PENDING: 'Beklemede',
      PROCESSING: "Proses'te",
      FINISHED: 'Bitti',
    };

    const statusbgColor = (status: string) => {
      if (status === 'FINISHED') {
        return (
          <MdCheckCircle className="me-1 text-green-500 dark:text-green-300" />
        );
      }
      if (status === 'PROCESSING') {
        return <MdCancel className="me-1 text-amber-500 dark:text-amber-300" />;
      }
      return (
        <MdOutlineError className="me-1 text-red-500 dark:text-red-300 " />
      );
    };
    switch (variant) {
      case 'customer':
        col = [
          columnHelper.accessor('id', {
            id: 'id',
            header: () => (
              <p className="group  relative min-w-[60px] max-w-fit whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                SİRA NO.
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
              <p className="group  relative whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                MÜŞTERİ KODU
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
              <p className="group relative text-sm font-bold text-gray-600 dark:text-white">
                SORUMLU
              </p>
            ),
            cell: (info: any) => (
              <p
                title={info.getValue()}
                className="line-clamp-1 min-w-[120px] text-sm font-bold text-navy-700 dark:text-white"
              >
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('country_code', {
            id: 'country_code',
            header: () => (
              <p className="group  relative min-w-[80px] whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                ÜLKE KODU
              </p>
            ),
            cell: (info: any) => (
              <p className="min-w-[90px] whitespace-nowrap break-keep text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('email', {
            id: 'email',
            header: () => (
              <p className="group  relative  whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
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
              <p className="group relative min-w-[200px] text-sm font-bold text-gray-600 dark:text-white">
                ADRES
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
              </p>
            ),
            cell: (info: any) => (
              <p className="whitespace-nowrap  break-keep text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('province_code', {
            id: 'province_code',
            header: () => (
              <p className="group  relative whitespace-nowrap break-keep text-sm font-bold text-gray-600 dark:text-white">
                İL KODU
              </p>
            ),
            cell: (info: any) => (
              <p className="min-w-[80px] whitespace-nowrap break-keep text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
        ];
        break;
      case 'process':
        col = [
          columnHelper.accessor('id', {
            id: 'id',
            header: () => (
              <p className="whitespace-nowrap  break-keep text-sm font-bold text-gray-600 dark:text-white">
                SİRA NO.
              </p>
            ),
            cell: ({ row }) => (
              <p className="min-w-[60px] text-sm font-bold text-navy-700 dark:text-white">
                {(row.index + 1).toString()}
              </p>
            ),
          }),
          columnHelper.accessor('product', {
            id: 'product',
            header: () => (
              <p className="min-w-[130px]  whitespace-nowrap break-keep text-sm font-bold uppercase text-gray-600 dark:text-white">
                Ürün İsmi
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
          columnHelper.accessor('application', {
            id: 'application',
            header: () => (
              <p className="min-w-[200px] text-sm font-bold uppercase text-gray-600 dark:text-white">
                Uygulama
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
          columnHelper.accessor('standard', {
            id: 'standard',
            header: () => (
              <p className="min-w-[110px] text-sm font-bold text-gray-600 dark:text-white">
                STANDART
              </p>
            ),
            cell: (info: any) => (
              <p className="line-clamp-1 text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('color', {
            id: 'color',
            header: () => (
              <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
                Renk
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
              <p className="min-w-[120px]  whitespace-nowrap break-keep text-sm font-bold uppercase text-gray-600 dark:text-white">
                PROSES DURUMU
              </p>
            ),
            cell: (info: any) => (
              <div className="flex min-w-[100px] items-center">
                {statusbgColor(info.getValue())}
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  {entryStatus[info.getValue()]}
                </p>
              </div>
            ),
          }),
          columnHelper.accessor('quantity', {
            id: 'quantity',
            header: () => (
              <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
                Miktar
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('machineName', {
            id: 'machineName',
            header: () => (
              <p className="min-w-[160px] text-sm font-bold uppercase text-gray-600 dark:text-white">
                Makine
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
        break;
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
    <Card extra={'w-full min-h-[320px] sm:overflow-auto px-6 pt-7 pb-10'}>
      <h2 className="text-lg font-bold text-navy-700 dark:text-white">
        {title}
      </h2>

      <div
        className="custom-scrollbar--hidden mt-2 overflow-x-scroll"
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
                        <td key={cell.id} className="p-3">
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
      </div>
    </Card>
  );
}

export default MiniTable;
const columnHelper = createColumnHelper<ProcessObj | CustomerObj>();
