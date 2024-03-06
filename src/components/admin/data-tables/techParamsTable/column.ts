import { TableCell } from './tableCell';
import { EditCell } from './editCell';
import { createColumnHelper } from '@tanstack/react-table';
import { techParameters } from '../../../../utils';

const columnHelper = createColumnHelper<any>();

// export const columns1 = [
//   columnHelper.accessor('studentId', {
//     header: 'Student ID',
//     cell: TableCell,
//     meta: {
//       type: 'number',
//     },
//   }),
//   columnHelper.accessor('name', {
//     header: 'Full Name',
//     cell: TableCell,
//     meta: {
//       type: 'text',
//     },
//   }),
//   columnHelper.accessor('dateOfBirth', {
//     header: 'Date Of Birth',
//     cell: TableCell,
//     meta: {
//       type: 'date',
//     },
//   }),
//   columnHelper.accessor('major', {
//     header: 'Major',
//     cell: TableCell,
//     meta: {
//       type: 'select',
//       options: [
//         { value: 'Computer Science', label: 'Computer Science' },
//         { value: 'Communications', label: 'Communications' },
//         { value: 'Business', label: 'Business' },
//         { value: 'Psychology', label: 'Psychology' },
//       ],
//     },
//   }),
//   columnHelper.display({
//     id: 'edit',
//     cell: EditCell,
//   }),
// ];

const newCol = [
  columnHelper.display({
    header: 'Düzenleme',
    id: 'edit',
    cell: EditCell,
  }),
];
techParameters.map((item) => {
  let temp = columnHelper.accessor(item.param_name, {
    header: item.display_name,
    cell: TableCell,
    meta: {
      type: 'text',
    },
  });
  newCol.push(temp);
});

export const columns = newCol;
