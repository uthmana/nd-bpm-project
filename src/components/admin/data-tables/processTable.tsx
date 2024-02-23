import React, { useMemo, useState } from 'react';
import Card from 'components/card';
import Search from 'components/search/search';
import Button from 'components/button/button';
import FileViewer from 'components/fileViewer';
import { useDrage } from 'utils';
import { ProcessObj, ProcessTable } from '../../../app/localTypes/table-types';
import TablePagination from './tablePagination';
import Barcode from 'react-jsbarcode';
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

function ProcessTable({
  tableData,
  onEdit,
  onDelete,
  onAdd,
  onControl,
  variant = 'NORMAL',
  searchValue,
}: ProcessTable) {
  let defaultData = tableData;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [search, setSearch] = useState(searchValue || '');
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

    col = [
      columnHelper.accessor('id', {
        id: 'id',
        header: () => (
          <p className="text-sm font-bold text-gray-600 dark:text-white">
            SİRA NO.
          </p>
        ),
        cell: ({ row }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {(row.index + 1).toString()}
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
          <p className="min-w-[100px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            Ürün Kodu
          </p>
        ),
        cell: (info: any) => (
          <p className="min-w-[150px] text-sm font-bold text-navy-700 dark:text-white">
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
          <p className=" text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('product', {
        id: 'product',
        header: () => (
          <p className="min-w-[130px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            Ürün İsmi
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

      columnHelper.accessor('application', {
        id: 'application',
        header: () => (
          <p className="min-w-[200px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            Uygulama
          </p>
        ),
        cell: (info: any) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
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
          <p className="text-sm font-bold text-navy-700 dark:text-white">
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
          <p className="min-w-[160px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            Makine
          </p>
        ),
        cell: (info: any) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('technicalDrawingAttachment', {
        id: 'technicalDrawingAttachment',
        header: () => (
          <p className="min-w-[110px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            İLGİLİ DOKÜMAN
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
          <p className="min-w-[120px] text-sm font-bold uppercase text-gray-600 dark:text-white">
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
      columnHelper.accessor('id', {
        id: 'id',
        header: () => (
          <p className="text-sm font-bold text-gray-600 dark:text-white">
            AKSIYON
          </p>
        ),
        cell: (info) => (
          <div className="flex gap-2">
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

        {/* <Button
            text="EKLE"
            extra="!w-[140px] h-[38px] font-bold"
            onClick={onAdd}
            icon={<MdAdd className="ml-1 h-6 w-6" />}
          /> */}
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

export default ProcessTable;
const columnHelper = createColumnHelper<ProcessObj>();
