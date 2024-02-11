import { TableCell } from './tableCell';
import { EditCell } from './editCell';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<any>();

export const columns1 = [
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

export const columns = [
  columnHelper.display({
    header: 'Düzenleme',
    id: 'edit',
    cell: EditCell,
  }),
  columnHelper.accessor('saat', {
    header: 'Üretim/Saat',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('viskozite', {
    header: 'viskozite',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('besleme_Tipi', {
    header: 'Besleme Tipi',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('besleme_Hizi', {
    header: 'Besleme Hizi',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('makine_Hizi', {
    header: 'Tipimakine Hizi',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('Hava Basinci', {
    header: 'Hava Basinci',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('firin_Bant_Hizi', {
    header: 'Firin Bant Hizi',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('induksiyon_kW', {
    header: 'induksiyon kW',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('induksiyon_Volts', {
    header: 'induksiyon Volts',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('induksiyon_kHz', {
    header: 'induksiyon kHz',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('patch_Vibrasyon_hizi', {
    header: 'patch Vibrasyon hizi',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('patch_Toz_yukleme_Hizi', {
    header: 'Patch Toz yukleme Hizi',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('teach_Ayari', {
    header: 'Teach Ayari',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('delay_Ayari', {
    header: 'Delay Ayari',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('purge_Ayari', {
    header: 'Purge Ayari',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('testere_secimi', {
    header: 'Testere secimi',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('kesim_Mesafesi', {
    header: 'kesim Mesafesi',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('yuva_Boyutu', {
    header: 'yuva Boyutu',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('patch_Hava_Basinci', {
    header: 'Patch Hava Basinci',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
];
