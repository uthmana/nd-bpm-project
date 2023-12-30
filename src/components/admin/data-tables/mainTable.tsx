import React, { useMemo, useState } from 'react';
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
import { IoMdArrowDown, IoMdArrowUp } from 'react-icons/io';

type UserObj = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  edit: string;
  delete: string;
};

type CustomerObj = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  postalCode: string;
  company_name: string;
  phoneNumber: string;
  phoneNumber2: string;
  code: string;
  definition: string;
  taxNo: string;
  tax_Office: string;
};

type StockObj = {
  product_code: string;
  product_name: string;
  product_barcode: string;
  inventory: number;
  current_price: string;
  description: string;
  main_group: string;
  group1: string;
  group2: string;
  brand: string;
  unit: string;
  curency: string;
  date: string;
  image: string;
};

type MainTable = {
  tableData: UserObj | CustomerObj | StockObj | any;
  variant: string;
  onEdit: (e: any) => void;
  onDelete: (e: any) => void;
  onAdd: (e: any) => void;
};

function MainTable({
  tableData,
  onEdit,
  onDelete,
  onAdd,
  variant = 'user',
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
    console.log(walk);
  };

  const columns = useMemo(() => {
    //let columns: any;
    let col: any;
    switch (variant) {
      case 'customer':
        col = [
          columnHelper.accessor('first_name', {
            id: 'first_name',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                AD
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('last_name', {
            id: 'last_name',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                SOYAD
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                TELEFON 1
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('phoneNumber2', {
            id: 'phoneNumber2',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                TELEFON 2
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
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),

          columnHelper.accessor('company_name', {
            id: 'company_name',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                ŞİRKET
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
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
              <p className="text-sm font-bold text-navy-700 dark:text-white">
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                VERGİ OFİSİ
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                SİL
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
        ];
        break;
      case 'stock':
        col = [
          columnHelper.accessor('image', {
            id: 'image',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                Ürün Resmi
              </p>
            ),
            cell: (info: any) => (
              <p className="max-w-[100px] text-sm font-bold text-navy-700 dark:text-white">
                <img className="w-full" src={`/uploads/${info.getValue()}`} />
              </p>
            ),
          }),

          columnHelper.accessor('product_code', {
            id: 'product_code',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                Ürün Adı
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                Ürün Barkodu
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                Anlık Maliyet Fıyati
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                Tarih
              </p>
            ),
            cell: (info: any) => (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
          }),
          columnHelper.accessor('brand', {
            id: 'brand',
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                Marka
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
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
        ];
        break;
      case 'user':
        col = [
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
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                SİL
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
        ];
    }
    return col;
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

export default MainTable;
const columnHelper = createColumnHelper<UserObj | CustomerObj | StockObj>();
