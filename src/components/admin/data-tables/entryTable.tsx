import React, { useMemo, useState } from 'react';
import Card from 'components/card';
import { MdModeEdit, MdOutlineDelete, MdAdd, MdCheck } from 'react-icons/md';
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
import { formatDateTime } from 'utils';
import FileViewer from 'components/fileViewer';

type FaultObj = {
  id: string;
  customerName: string;
  traceabilityCode: string;
  arrivalDate: string;
  invoiceDate: string;
  product: string;
  quantity: number;
  productCode: string;
  productBatchNumber: string;
  application: string;
  standard: string;
  color: string;
  faultDescription: string;
  status: string;
  technicalDrawingAttachment: string;
  controlInfo: string;
};

type MainTable = {
  tableData: FaultObj[];
  variant: string;
  onEdit: (e: any) => void;
  onDelete: (e: any) => void;
  onAdd: (e: any) => void;
  onControl: (e: any) => void;
};

function EntryTable({
  tableData,
  onEdit,
  onDelete,
  onAdd,
  onControl,
  variant = 'NORMAL',
}: MainTable) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  let defaultData = tableData;

  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
    e.currentTarget.classList.add('dragging-active');
  };

  const handleMouseLeave = (e) => {
    setIsDown(false);
    e.currentTarget.classList.remove('dragging-active');
  };

  const handleMouseUp = (e) => {
    setIsDown(false);
    e.currentTarget.classList.remove('dragging-active');
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 3; // scroll-fast
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  const columns = useMemo(() => {
    let col: any;

    const entryStatus = {
      PENDING: 'Beklemede',
      REGECT: 'Ret',
      ACCEPT: 'Kabul',
    };

    col = [
      columnHelper.accessor('technicalDrawingAttachment', {
        id: 'technicalDrawingAttachment',
        header: () => (
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
            İlgi Doküman
          </p>
        ),
        cell: (info: any) => (
          <p className="max-w-[100px] text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue() ? <FileViewer file={info.getValue()} /> : null}
          </p>
        ),
      }),
      columnHelper.accessor('traceabilityCode', {
        id: 'traceabilityCode',
        header: () => (
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
            Takip Kodu
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
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
            Variş Tarihi
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
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
            İrsalye Tarihi
          </p>
        ),
        cell: (info: any) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {formatDateTime(info.getValue())}
          </p>
        ),
      }),
      columnHelper.accessor('product', {
        id: 'product',
        header: () => (
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
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
      columnHelper.accessor('productCode', {
        id: 'productCode',
        header: () => (
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
            Ürün Kodu
          </p>
        ),
        cell: (info: any) => (
          <p className="flex text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor('productBatchNumber', {
        id: 'productBatchNumber',
        header: () => (
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
            Batch No.
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
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
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
          <p className="text-sm font-bold text-gray-600 dark:text-white">
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
      columnHelper.accessor('faultDescription', {
        id: 'faultDescription',
        header: () => (
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
            Açıklama
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
          <p className="rounded-lg bg-yellow-400 py-1 text-center text-sm font-bold text-navy-700">
            {entryStatus[info.getValue()]}
          </p>
        ),
      }),
    ];

    if (variant === 'NORMAL' || variant === 'ADMIN') {
      col.push(
        columnHelper.accessor('id', {
          id: 'id',
          header: () => (
            <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
              DÜZENLE
            </p>
          ),
          cell: (info: any) => (
            <button
              className="ml-3 rounded-md bg-green-600 px-3 py-2 hover:bg-green-700"
              onClick={() => onEdit(info.getValue())}
            >
              <MdModeEdit className="h-5 w-5 text-white" />
            </button>
          ),
        }),
        columnHelper.accessor('id', {
          id: 'id',
          header: () => (
            <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
              DELETE
            </p>
          ),
          cell: (info) => (
            <button
              className="rounded-md bg-red-600 px-3 py-2 hover:bg-red-700"
              onClick={() => onDelete(info.getValue())}
            >
              <MdOutlineDelete className="h-5 w-5 text-white" />
            </button>
          ),
        }),
      );
      if (variant === 'ADMIN')
        col.push(
          columnHelper.accessor('id', {
            id: 'id',
            header: () => (
              <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
                KONTROL FORMU
              </p>
            ),
            cell: (info: any) => (
              <button
                className="ml-3 rounded-md bg-blue-600 px-3 py-2 hover:bg-blue-700"
                onClick={() => onControl(info.getValue())}
              >
                <MdCheck className="h-5 w-5 text-white" />
              </button>
            ),
          }),
        );
      return col;
    }
    if (variant === 'SUPER' || variant === 'TECH') {
      col.push(
        columnHelper.accessor('id', {
          id: 'id',
          header: () => (
            <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
              KONTROL FORMU
            </p>
          ),
          cell: (info: any) => (
            <button
              className="ml-3 rounded-md bg-blue-600 px-3 py-2 hover:bg-blue-700"
              onClick={() => onControl(info.getValue())}
            >
              <MdCheck className="h-5 w-5 text-white" />
            </button>
          ),
        }),
      );
      return col;
    }
  }, []);

  const [data, setData] = React.useState(() => [...defaultData]);
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

        {variant === 'NORMAL' || variant === 'ADMIN' ? (
          <Button
            text="EKLE"
            extra="!w-[140px] h-[38px] font-bold"
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
                        <td key={cell.id} className="min-w-[100px] px-2 py-1">
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
        <div className="sticky left-0 mb-4 mt-5 flex w-full items-center gap-2">
          <button
            className="w-7 rounded border p-1 dark:border-gray-800"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="w-7 rounded border p-1 dark:border-gray-800"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            className="w-7 rounded border p-1 dark:border-gray-800"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="w-7 rounded border p-1 dark:border-gray-800"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
          <span className="flex items-center gap-1 text-[12px] dark:border-gray-800">
            <div>Sayfa</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="ml-4 flex items-center gap-1 text-[12px] dark:border-gray-800">
            Sayfaya git:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16 rounded border p-1 dark:border-gray-800 dark:bg-blueSecondary"
            />
          </span>
          <select
            className="h-7 rounded text-[12px] dark:bg-blueSecondary"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Göster {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}

export default EntryTable;
const columnHelper = createColumnHelper<FaultObj>();
