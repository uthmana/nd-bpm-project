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
import FileViewer from 'components/fileViewer';
import { FaultObj, MainTable } from 'app/localTypes/table-types';
import TablePagination from './tablePagination';

function EntryTable({
  tableData,
  onEdit,
  onDelete,
  onAdd,
  onControl,
  variant = 'NORMAL',
  searchValue,
}: MainTable) {
  let defaultData = tableData;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [search, setSearch] = useState(searchValue || '');
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useDrage();

  const columns = useMemo(() => {
    const entryStatus = {
      PENDING: 'Beklemede',
      REJECT: 'Ret',
      ACCEPT: 'Kabul',
      ACCEPTANCE_WITH_CONDITION: 'Şartlı Kabul',
      PRE_PROCESS: 'Ön İşlem Gerekli',
    };
    const statusbgColor = (status: string) => {
      if (status === 'ACCEPT' || status === 'ACCEPTANCE_WITH_CONDITION') {
        return (
          <MdCheckCircle className="me-1 text-green-500 dark:text-green-300" />
        );
      }
      if (status === 'REJECT') {
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
          <p className="group relative min-w-[65px] max-w-fit  whitespace-nowrap break-keep  text-sm font-bold text-gray-600 dark:text-white">
            SİRA NO.{' '}
            <span className="absolute right-0 top-0 hidden group-hover:block">
              <MdOutlineKeyboardDoubleArrowDown />
            </span>
          </p>
        ),
        cell: ({ row }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {(row.index + 1).toString()}
          </p>
        ),
      }),
      columnHelper.accessor('product_barcode', {
        id: 'product_barcode',
        header: () => (
          <p className="group relative min-w-[150px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            BARKOD{' '}
            <span className="absolute right-0 top-0 hidden group-hover:block">
              <MdOutlineKeyboardDoubleArrowDown />
            </span>
          </p>
        ),
        cell: (info: any) => (
          <p className="min-w-[180px]  text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('productCode', {
        id: 'productCode',
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
          <p className="group relative min-w-[200px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            Müşteri{' '}
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
      columnHelper.accessor('product', {
        id: 'product',
        header: () => (
          <p className="group relative min-w-[160px] max-w-[180px] whitespace-nowrap break-keep text-sm font-bold uppercase text-gray-600 dark:text-white">
            Ürün İsmi{' '}
            <span className="absolute right-0 top-0 hidden group-hover:block">
              <MdOutlineKeyboardDoubleArrowDown />
            </span>
          </p>
        ),
        cell: (info: any) => (
          <p
            title={info.getValue()}
            className="clamp-1 text-sm font-bold text-navy-700 dark:text-white"
          >
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('quantity', {
        id: 'quantity',
        header: () => (
          <p className="group relative text-sm font-bold uppercase text-gray-600 dark:text-white">
            Miktar{' '}
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

      columnHelper.accessor('arrivalDate', {
        id: 'arrivalDate',
        header: () => (
          <p className="group relative min-w-[120px] whitespace-nowrap break-keep  text-sm font-bold uppercase text-gray-600 dark:text-white">
            GİRİŞ TARİHİ{' '}
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
      columnHelper.accessor('application', {
        id: 'application',
        header: () => (
          <p className="group relative min-w-[200px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            Uygulama{' '}
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
      columnHelper.accessor('standard', {
        id: 'standard',
        header: () => (
          <p className="group relative text-sm font-bold text-gray-600 dark:text-white">
            STANDART{' '}
            <span className="absolute right-0 top-0 hidden group-hover:block">
              <MdOutlineKeyboardDoubleArrowDown />
            </span>
          </p>
        ),
        cell: (info: any) => (
          <p
            title={info.getValue()}
            className="line-clamp-1 min-w-[100px] text-sm font-bold text-navy-700 dark:text-white"
          >
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('color', {
        id: 'color',
        header: () => (
          <p className="group relative text-sm font-bold uppercase text-gray-600 dark:text-white">
            Renk{' '}
            <span className="absolute right-0 top-0 hidden group-hover:block">
              <MdOutlineKeyboardDoubleArrowDown />
            </span>
          </p>
        ),
        cell: (info: any) => (
          <p className="min-w-[80px] text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('faultDescription', {
        id: 'faultDescription',
        header: () => (
          <p className="group relative text-sm font-bold uppercase text-gray-600 dark:text-white">
            Açıklama{' '}
            <span className="absolute right-0 top-0 hidden group-hover:block">
              <MdOutlineKeyboardDoubleArrowDown />
            </span>
          </p>
        ),
        cell: (info: any) => (
          <p
            title={info.getValue()}
            className="line-clamp-1 min-w-[180px] text-sm font-bold text-navy-700 dark:text-white"
          >
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('technicalDrawingAttachment', {
        id: 'technicalDrawingAttachment',
        header: () => (
          <p className="min-w-[110px] whitespace-nowrap break-keep text-sm font-bold uppercase text-gray-600 dark:text-white">
            İlgi Doküman
          </p>
        ),
        cell: (info: any) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue() ? <FileViewer file={info.getValue()} /> : null}
          </p>
        ),
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: () => (
          <p className="min-w-[130px] whitespace-nowrap break-keep text-sm font-bold uppercase text-gray-600 dark:text-white">
            KONTROL DURUMU
          </p>
        ),
        cell: (info: any) => (
          <div className="flex items-center">
            {statusbgColor(info.getValue())}
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {entryStatus[info.getValue()]}
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
          const isAccept =
            info.row.original.status === 'ACCEPT' ||
            info.row.original.status === 'ACCEPTANCE_WITH_CONDITION';
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
        {variant === 'NORMAL' || variant === 'ADMIN' ? (
          <Button
            text="EKLE"
            extra="!w-[140px] h-[38px] font-bold mb-3"
            onClick={onAdd}
            icon={<MdAdd className="ml-1 h-6 w-6" />}
          />
        ) : null}
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

export default EntryTable;
const columnHelper = createColumnHelper<FaultObj>();
