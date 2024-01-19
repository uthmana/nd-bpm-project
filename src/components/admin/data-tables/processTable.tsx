import React, { useMemo, useState } from 'react';
import Card from 'components/card';
import {
  MdModeEdit,
  MdOutlineDelete,
  MdAdd,
  MdCheck,
  MdCheckCircle,
  MdCancel,
  MdOutlineError,
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

type ProcessObj = {
  id: string;
  customerName: string;
  product: string;
  quantity: number;
  productCode: string;
  application: string;
  machineName: string;
  standard: string;
  color: string;
  status: string;
};

type MainTable = {
  tableData: ProcessObj[];
  variant: string;
  onEdit?: (e: any) => void;
  onDelete?: (e: any) => void;
  onAdd?: (e: any) => void;
  onControl?: (e: any) => void;
  searchValue?: string;
};

function ProcessTable({
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
      PROCESSING: "Proses'de",
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
      columnHelper.accessor('customerName', {
        id: 'customerName',
        header: () => (
          <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
            Müşteri
          </p>
        ),
        cell: (info: any) => (
          <p className="min-w-[100px] text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
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
          <p className="min-w-[100px] text-sm font-bold text-navy-700 dark:text-white">
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
          <p className="min-w-[100px] text-sm font-bold text-navy-700 dark:text-white">
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
      columnHelper.accessor('machineName', {
        id: 'machineName',
        header: () => (
          <p className="min-w-[200px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            Makine
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
              {entryStatus[info.getValue()]}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor('id', {
        id: 'id',
        header: () => (
          <p className="min-w-[130px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            PARAMETRE
          </p>
        ),
        cell: (info: any) => (
          <button
            className="ml-3 flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-sm font-bold text-white hover:bg-blue-700"
            onClick={() => onAdd(info.row.original)}
          >
            <MdAdd className="h-5 w-5 text-white" />
            Ekle
          </button>
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

export default ProcessTable;
const columnHelper = createColumnHelper<ProcessObj>();
