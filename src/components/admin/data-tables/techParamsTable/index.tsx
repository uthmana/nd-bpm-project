import { useState } from 'react';
import './table.css';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FooterCell } from './footerCell';
import { columns } from './column';
import { formatDateTime } from 'utils';
import TableEmpty from '../tableEmpty';

type Student = {
  studentId: number;
  name: string;
  dateOfBirth: string;
  major: string;
};

const TechParamsTable = (props: {
  techParams?: any;
  defaultTechParams?: any;
  fields?: any;
  onUpdateData?: (a, b) => void;
  onAddRow?: (a) => void;
  onRemoveRow?: (a) => void;
  status?: string;
}) => {
  const {
    techParams = [],
    defaultTechParams,
    fields,
    onUpdateData,
    onAddRow,
    onRemoveRow,
    status,
  } = props;

  const [data, setData] = useState(() => [...techParams]);
  const [originalData, setOriginalData] = useState(() => [...techParams]);
  const [editedRows, setEditedRows] = useState({});

  let filteredColumns = columns.filter((item: any) => {
    return fields?.includes(item.accessorKey) || item?.id === 'edit';
  });

  if (status === 'FINISHED') {
    filteredColumns = [...filteredColumns].filter((item: any) => {
      return item?.id !== 'edit';
    });
  }

  const table = useReactTable({
    data,
    columns: filteredColumns || [],
    getCoreRowModel: getCoreRowModel(),
    meta: {
      editedRows,
      setEditedRows,
      revertData: (rowIndex: number, revert: boolean) => {
        if (revert) {
          setData((old) =>
            old.map((row, index) =>
              index === rowIndex ? originalData[rowIndex] : row,
            ),
          );
        } else {
          setOriginalData((old) =>
            old.map((row, index) =>
              index === rowIndex ? data[rowIndex] : row,
            ),
          );
        }
      },
      updateRow: (rowIndex: number) => {
        onUpdateData(data[rowIndex].id, data[rowIndex]);
      },
      updateData: (rowIndex: number, columnId: string, value: string) => {
        const updateFunc = (old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }

            return row;
          });

        setData(updateFunc);
      },
      addRow: () => {
        let val: Record<string, unknown> = {};

        filteredColumns.forEach((item: any) => {
          let defaultVal: string | unknown = '';

          if (item.accessorKey) {
            if (Object.keys(defaultTechParams).length > 0) {
              const techValue = defaultTechParams[item.accessorKey];
              if (techValue !== undefined) {
                defaultVal = techValue;
              }
            }

            val[item.accessorKey] = defaultVal;
          }
        });

        onAddRow(val);
      },
      removeRow: (rowIndex: number) => {
        onRemoveRow(data[rowIndex].id);
        const setFilterFunc = (old: Student[]) =>
          old.filter((_row: Student, index: number) => index !== rowIndex);
        setOriginalData(setFilterFunc);
        setData(setFilterFunc);
      },
      removeSelectedRows: (selectedRows: number[]) => {
        selectedRows.forEach((rowIndex) => {
          onRemoveRow(data[rowIndex].id);
        });
        const setFilterFunc = (old: Student[]) =>
          old.filter((_row, index) => !selectedRows.includes(index));
        setData(setFilterFunc);
        setOriginalData(setFilterFunc);
      },
    },
  });

  return (
    <article className="h-full w-full overflow-auto">
      <table className="tech-table w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="!border-px !border-gray-400">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="min-w-fit cursor-pointer whitespace-nowrap break-keep  border-b border-gray-400 px-1 text-start dark:border-white/30"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="dark:text-white [&>*:nth-child(even)]:dark:!bg-navy-800">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-100 hover:bg-lightPrimary dark:border-gray-900 dark:hover:bg-navy-700"
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <td
                    key={cell.id}
                    className={`p-1 ${cell.getContext()?.column.id}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 ? <TableEmpty /> : null}

      {status !== 'FINISHED' ? (
        <div className="sticky left-0 mt-4 flex w-[120px] justify-center rounded-lg bg-blueSecondary px-3 py-2 text-center text-sm font-bold text-white">
          <FooterCell table={table} />
        </div>
      ) : null}
    </article>
  );
};

export default TechParamsTable;
