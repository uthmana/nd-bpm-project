import { useState } from 'react';
import './table.css';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FooterCell } from './footerCell';
import { TableCell } from './tableCell';
import { EditCell } from './editCell';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<Student>();

const columns = [
  columnHelper.accessor('studentId', {
    header: 'Student ID',
    cell: TableCell,
    meta: {
      type: 'number',
    },
  }),
  columnHelper.accessor('name', {
    header: 'Full Name',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('dateOfBirth', {
    header: 'Date Of Birth',
    cell: TableCell,
    meta: {
      type: 'date',
    },
  }),
  columnHelper.accessor('major', {
    header: 'Major',
    cell: TableCell,
    meta: {
      type: 'select',
      options: [
        { value: 'Computer Science', label: 'Computer Science' },
        { value: 'Communications', label: 'Communications' },
        { value: 'Business', label: 'Business' },
        { value: 'Psychology', label: 'Psychology' },
      ],
    },
  }),
  columnHelper.display({
    id: 'edit',
    cell: EditCell,
  }),
];

type Student = {
  studentId: number;
  name: string;
  dateOfBirth: string;
  major: string;
};

const Table = () => {
  const defaultData: Student[] = [
    {
      studentId: 1111,
      name: 'Bahar Constantia',
      dateOfBirth: '1984-01-04',
      major: 'Computer Science',
    },
    {
      studentId: 2222,
      name: 'Harold Nona',
      dateOfBirth: '1961-05-10',
      major: 'Communications',
    },
    {
      studentId: 3333,
      name: 'Raginolf Arnulf',
      dateOfBirth: '1991-10-12',
      major: 'Business',
    },
    {
      studentId: 4444,
      name: 'Marvyn Wendi',
      dateOfBirth: '1978-09-24',
      major: 'Psychology',
    },
  ];
  const [data, setData] = useState(() => [...defaultData]);
  const [originalData, setOriginalData] = useState(() => [...defaultData]);
  const [editedRows, setEditedRows] = useState({});

  const table = useReactTable({
    data,
    columns,
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
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
      addRow: () => {
        const newRow: Student = {
          studentId: Math.floor(Math.random() * 10000),
          name: '',
          dateOfBirth: '',
          major: '',
        };
        const setFunc = (old: Student[]) => [...old, newRow];
        setData(setFunc);
        setOriginalData(setFunc);
      },
      removeRow: (rowIndex: number) => {
        const setFilterFunc = (old: Student[]) =>
          old.filter((_row: Student, index: number) => index !== rowIndex);
        setData(setFilterFunc);
        setOriginalData(setFilterFunc);
      },
      removeSelectedRows: (selectedRows: number[]) => {
        const setFilterFunc = (old: Student[]) =>
          old.filter((_row, index) => !selectedRows.includes(index));
        setData(setFilterFunc);
        setOriginalData(setFilterFunc);
      },
    },
  });

  return (
    <article className="table-container">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
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
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={table.getCenterLeafColumns().length} align="right">
              <FooterCell table={table} />
            </th>
          </tr>
        </tfoot>
      </table>
    </article>
  );
};
