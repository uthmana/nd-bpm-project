import { TableCell } from './tableCell';
import { EditCell } from './editCell';
import { createColumnHelper } from '@tanstack/react-table';
import { techParameters } from '../../../../utils';
const columnHelper = createColumnHelper<any>();

const newCol = [
  columnHelper.display({
    header: 'Düzenleme',
    id: 'edit',
    cell: EditCell,
  }),
];
techParameters.map((item) => {
  let temp: any = columnHelper.accessor(item.param_name, {
    header: item.display_name,
    cell: TableCell,
    meta: {
      type: 'text',
    },
  });
  newCol.push(temp);
});

export const columns = newCol;
