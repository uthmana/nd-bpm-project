/* eslint-disable react/display-name */
import React, { useMemo, useState } from 'react';
import Card from 'components/card';
import Search from 'components/search/search';
import FileViewer from 'components/fileViewer';
import { useDrage, formatNumberLocale } from 'utils';
import { ProcessObj, ProcessTypeTable } from 'app/localTypes/table-types';
import TablePagination from './tablePagination';

import {
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
import TableEmpty from './tableEmpty';

function ProcessTable({
  tableData,
  onEdit,
  onDelete,
  onAdd,
  onControl,
  variant = 'NORMAL',
  searchValue,
}: ProcessTypeTable) {
  let defaultData = tableData;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [search, setSearch] = useState(searchValue || '');
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useDrage();

  const columns = useMemo(() => {
    let col: any;

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

    col = [
      columnHelper.accessor('id', {
        id: 'id',
        header: () => (
          <p className="whitespace-nowrap  break-keep text-sm font-bold text-gray-600 dark:text-white">
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
          <p className="text-sm font-bold text-gray-600 dark:text-white">
            AKSIYON
          </p>
        ),
        cell: (info) => (
          <div className="flex gap-1">
            <button
              className="rounded-md bg-blue-600  px-2 py-1 hover:bg-blue-700"
              onClick={() => onControl(info.getValue())}
            >
              <MdPreview className="h-5 w-5 text-white" />
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
      columnHelper.accessor('product_barcode', {
        id: 'product_barcode',
        header: () => (
          <p className="min-w-[150px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            BARKODU
          </p>
        ),
        cell: (info: any) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      // columnHelper.accessor('faultId', {
      //   id: 'faultId',
      //   header: () => (
      //     <p className="min-w-[150px] text-sm font-bold text-gray-600 dark:text-white">
      //       BARKOD
      //     </p>
      //   ),
      //   cell: (info: any) => (
      //     <p className="text-sm font-bold text-navy-700 dark:text-white">
      //       <Barcode
      //         className="h-full w-full"
      //         value={info.getValue()}
      //         options={{ format: 'code128' }}
      //       />
      //     </p>
      //   ),
      // }),
      columnHelper.accessor('productCode', {
        id: 'productCode',
        header: () => (
          <p className="min-w-[100px]  whitespace-nowrap break-keep text-sm font-bold uppercase text-gray-600 dark:text-white">
            Ürün Kodu
          </p>
        ),
        cell: (info: any) => (
          <p className="min-w-[150px]  whitespace-nowrap break-keep text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      // columnHelper.accessor('customerName', {
      //   id: 'customerName',
      //   header: () => (
      //     <p className="min-w-[200px] text-sm font-bold uppercase text-gray-600 dark:text-white">
      //       Müşteri
      //     </p>
      //   ),
      //   cell: (info: any) => (
      //     <p
      //       title={info.getValue()}
      //       className="line-clamp-1 text-sm font-bold text-navy-700 dark:text-white"
      //     >
      //       {info.getValue()}
      //     </p>
      //   ),
      // }),
      columnHelper.accessor('product', {
        id: 'product',
        header: () => (
          <p className="min-w-[130px]  whitespace-nowrap break-keep text-sm font-bold uppercase text-gray-600 dark:text-white">
            Ürün İsmi
          </p>
        ),
        cell: (info: any) => (
          <p className="whitespace-nowrap  break-keep text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
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
            {formatNumberLocale(info.getValue())}
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
            className="whitespace-nowrap  break-keep  text-sm font-bold text-navy-700 dark:text-white"
          >
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('standard', {
        id: 'standard',
        header: () => (
          <p className="text-sm font-bold text-gray-600 dark:text-white">
            STANDART
          </p>
        ),
        cell: (info: any) => (
          <p className="whitespace-nowrap  break-keep text-sm font-bold text-navy-700 dark:text-white">
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
      columnHelper.accessor('machineName', {
        id: 'machineName',
        header: () => (
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
            Makine
          </p>
        ),
        cell: (info: any) => (
          <p
            title={info.getValue()}
            className="whitespace-nowrap  break-keep text-sm font-bold text-navy-700 dark:text-white"
          >
            {info.getValue()}
          </p>
        ),
      }),
      // columnHelper.accessor('technicalDrawingAttachment', {
      //   id: 'technicalDrawingAttachment',
      //   header: () => (
      //     <p className="min-w-[110px]  whitespace-nowrap break-keep text-sm font-bold uppercase text-gray-600 dark:text-white">
      //       İLGİLİ DOKÜMAN
      //     </p>
      //   ),
      //   cell: (info: any) => (
      //     <p className="text-sm font-bold text-navy-700 dark:text-white">
      //       {info.getValue() ? <FileViewer file={info.getValue()} /> : null}
      //     </p>
      //   ),
      // }),
      // columnHelper.accessor('newtechparam', {
      //   id: 'newtechparam',
      //   header: () => (
      //     <p className="min-w-[110px]  whitespace-nowrap break-keep text-sm font-bold uppercase text-gray-600 dark:text-white">
      //       İLGİLİ DOKÜMAN
      //     </p>
      //   ),
      //   cell: (info: any) => (
      //     <div className="flex">
      //       {info
      //         .getValue()
      //         ?.toString()
      //         ?.split(';')
      //         ?.map((url, index) => (
      //           <span
      //             key={index}
      //             className="text-sm font-bold text-navy-700 dark:text-white"
      //           >
      //             {info.getValue() ? <FileViewer file={url} /> : null}
      //           </span>
      //         ))}
      //     </div>
      //   ),
      // }),
      columnHelper.accessor('status', {
        id: 'status',
        header: () => (
          <p className="whitespace-nowrap break-keep text-sm font-bold uppercase text-gray-600 dark:text-white">
            DURUM
          </p>
        ),
        cell: (info: any) => (
          <div className="flex min-w-[100px] items-center">
            {statusbgColor(info.getValue())}
            <p className="whitespace-nowrap  break-keep  text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          </div>
        ),
      }),
    ];
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
                          <td key={cell.id + idx} className="py-1 pr-2">
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

export default ProcessTable;
const columnHelper = createColumnHelper<ProcessObj>();
