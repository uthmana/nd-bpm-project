import React, { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import {
  MdModeEdit,
  MdOutlineDelete,
  MdAdd,
  MdCheck,
  MdCheckCircle,
  MdCancel,
  MdOutlineError,
} from 'react-icons/md';
import FileViewer from 'components/fileViewer';
import { formatDateTime } from 'utils';
import { FaultObj } from '../../../../app/localTypes/table-types';

export const entryColumns = (
  variant: string,
  status: string,
  onEdit,
  onDelete,
  onControl,
) => {
  let col: any;

  const entryStatus = {
    PENDING: 'Beklemede',
    REJECT: 'Ret',
    ACCEPT: 'Kabul',
    ACCEPTANCE_WITH_CONDITION: 'Şartlı Kabul',
    PRE_PROCESS: 'Ön İşlem Gerekli',
  };

  const statusbgColor = (ColorStatus: string) => {
    if (
      ColorStatus === 'ACCEPT' ||
      ColorStatus === 'ACCEPTANCE_WITH_CONDITION'
    ) {
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

  const statusbtnAction = (btnActionStatus: string) => {
    if (
      btnActionStatus === 'ACCEPT' ||
      btnActionStatus === 'ACCEPTANCE_WITH_CONDITION' ||
      btnActionStatus === 'REJECT'
    ) {
      return <MdCheck className="h-5 w-5 text-white" />;
    }
    return <MdAdd className="h-5 w-5 text-white" />;
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
    columnHelper.accessor('id', {
      id: 'id',
      header: () => (
        <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
          Takip Kodu
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
    columnHelper.accessor('productBatchNumber', {
      id: 'productBatchNumber',
      header: () => (
        <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
          Batch No.
        </p>
      ),
      cell: (info: any) => (
        <p className="min-w-[100px] text-sm font-bold text-navy-700 dark:text-white">
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
        <p className="min-w-[120px] text-sm font-bold text-navy-700 dark:text-white">
          {formatDateTime(info.getValue())}
        </p>
      ),
    }),
    columnHelper.accessor('invoiceDate', {
      id: 'invoiceDate',
      header: () => (
        <p className="min-w-[120px] text-sm font-bold uppercase text-gray-600 dark:text-white">
          İrsalye Tarihi
        </p>
      ),
      cell: (info: any) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {formatDateTime(info.getValue())}
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
    columnHelper.accessor('faultDescription', {
      id: 'faultDescription',
      header: () => (
        <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
          Açıklama
        </p>
      ),
      cell: (info: any) => (
        <p className="min-w-[100px] text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor('technicalDrawingAttachment', {
      id: 'technicalDrawingAttachment',
      header: () => (
        <p className="text-sm font-bold uppercase text-gray-600 dark:text-white">
          İlgi Doküman
        </p>
      ),
      cell: (info: any) => (
        <p className="min-w-[110px] text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue() ? <FileViewer file={info.getValue()} /> : null}
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
  ];

  if (variant === 'NORMAL' || variant === 'ADMIN') {
    col.push(
      columnHelper.accessor('id', {
        id: 'id',
        header: () => (
          <p className="min-w-[80px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            DÜZENLE
          </p>
        ),
        cell: (info: any) => (
          <div className="flex gap-2">
            {info.row.original.status === 'ACCEPT' &&
            variant === 'NORMAL' ? null : (
              <>
                <button
                  className="rounded-md bg-green-600 px-2 py-1 hover:bg-green-700"
                  onClick={() => onEdit(info.getValue())}
                >
                  <MdModeEdit className="h-5 w-5 text-white" />
                </button>
                <button
                  className="rounded-md bg-red-600 px-2 py-1 hover:bg-red-700"
                  onClick={() => onDelete(info.getValue())}
                >
                  <MdOutlineDelete className="h-5 w-5 text-white" />
                </button>
              </>
            )}
          </div>
        ),
      }),
    );
    if (variant === 'ADMIN')
      col.push(
        columnHelper.accessor('id', {
          id: 'id',
          header: () => (
            <p className="min-w-[120px] text-sm font-bold uppercase text-gray-600 dark:text-white">
              KONTROL FORMU
            </p>
          ),
          cell: (info: any) => (
            <button
              className="ml-3 flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-sm font-bold text-white hover:bg-blue-700"
              onClick={() => onControl(info.getValue())}
            >
              {statusbtnAction(info.row.original.status)} Kontrol
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
          <p className="min-w-[130px] text-sm font-bold uppercase text-gray-600 dark:text-white">
            KONTROL FORMU
          </p>
        ),
        cell: (info: any) => (
          <button
            className="ml-3 flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-sm font-bold text-white hover:bg-blue-700"
            onClick={() => onControl(info.getValue())}
          >
            {statusbtnAction(info.row.original.status)} Kontrol
          </button>
        ),
      }),
    );
    return col;
  }
};

const columnHelper = createColumnHelper<FaultObj>();
