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
        let val = {};
        const rowKeys = filteredColumns.map((item: any) => {
          let defaultVal: string | unknown = '';
          if (item.accessorKey !== undefined) {
            if (item.accessorKey === 'Ort_Uretim_saat') {
              defaultVal = formatDateTime(new Date())?.slice(11);
            }
            if (JSON.stringify(defaultTechParams) !== '{}') {
              Object.entries(defaultTechParams).forEach(([key, value]) => {
                if (
                  key === item.accessorKey &&
                  item.accessorKey !== 'Ort_Uretim_saat'
                ) {
                  defaultVal = value;
                }
              });
            }
            return (val[item.accessorKey] = defaultVal);
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
                  className="min-w-[140px] cursor-pointer  border-b border-gray-400 px-1 text-start dark:border-white/30"
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
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="min-w-[70px] p-1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        {data.length === 0 ? (
          <tfoot>
            <tr>
              <th
                className="py-8 font-normal opacity-40"
                colSpan={table.getCenterLeafColumns().length}
                align="center"
              >
                Henüz teknik parametreleri eklenmedi
              </th>
            </tr>
          </tfoot>
        ) : null}
      </table>
      {status !== 'FINISHED' ? (
        <div className="sticky left-0 mt-4 flex w-[120px] justify-center rounded-lg bg-blueSecondary px-3 py-2 text-center text-center text-sm font-bold text-white">
          <FooterCell table={table} />
        </div>
      ) : null}
    </article>
  );
};

export default TechParamsTable;
