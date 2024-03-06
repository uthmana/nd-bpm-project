import { createColumnHelper } from '@tanstack/react-table';
import FileViewer from 'components/fileViewer';
import {
  MdCancel,
  MdCheckCircle,
  MdModeEdit,
  MdOutlineDelete,
  MdOutlineError,
  MdOutlineKeyboardDoubleArrowDown,
  MdPreview,
} from 'react-icons/md';
import { formatDateTime } from 'utils';

const columnHelper = createColumnHelper<any>();

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
  return <MdOutlineError className="me-1 text-amber-500 dark:text-amber-300" />;
};

export const entryCol = [
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
          {/* <button
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
          </button> */}
        </div>
      );
    },
  }),
];
