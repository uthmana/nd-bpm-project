import React from 'react';

// Admin Imports

// Icon Imports
import {
  MdHome,
  MdPerson,
  MdGroupWork,
  MdOutlineBusiness,
  MdOutlineGroups3,
  MdOutlineMultilineChart,
  MdSettings,
  MdTaskAlt,
  MdLocalOffer,
  MdLock,
  MdOutlineSportsCricket,
} from 'react-icons/md';

const iconStyle = 'h-6 w-6 !hover:text-[black] dark:!hover:text-white';

const routes = [
  {
    name: 'Panel',
    layout: '/admin',
    path: 'dashboard',
    role: ['admin', 'super'],
    icon: <MdHome className={`${iconStyle}`} />,
  },
  {
    name: 'Müşteri',
    layout: '/admin',
    path: 'customer',
    role: ['admin', 'super'],
    icon: <MdOutlineGroups3 className={`${iconStyle}`} />,
  },
  {
    name: 'Liste',
    layout: '/admin',
    path: 'liste',
    role: ['admin', 'super', 'normal', 'tech'],
    icon: <MdOutlineSportsCricket className={`${iconStyle}`} />,
  },
  {
    name: 'Stok',
    layout: '/admin',
    path: 'stock',
    role: ['admin', 'super', 'normal', 'tech'],
    icon: <MdOutlineMultilineChart className={`${iconStyle}`} />,
  },
  {
    name: 'Ürün Girişi',
    layout: '/admin',
    path: 'entry',
    role: ['admin', 'super', 'normal', 'tech'],
    icon: <MdOutlineBusiness className={`${iconStyle}`} />,
  },
  {
    name: 'Proses',
    layout: '/admin',
    path: 'process',
    role: ['admin', 'super', 'normal', 'tech'],
    icon: <MdGroupWork className={`${iconStyle}`} />,
  },
  {
    name: 'İrsaliye',
    layout: '/admin',
    path: 'invoice',
    role: ['admin', 'super', 'normal'],
    icon: <MdTaskAlt className={`${iconStyle}`} />,
  },
  {
    name: 'Teklif',
    layout: '/admin',
    path: 'offer',
    role: ['admin'],
    icon: <MdLocalOffer className={`${iconStyle}`} />,
  },
  {
    name: 'Kullanıcılar',
    layout: '/admin',
    path: 'users',
    role: ['admin'],
    icon: <MdPerson className={`${iconStyle}`} />,
  },
  {
    name: 'Ayarlar',
    layout: '/admin',
    path: 'settings',
    role: ['admin'],
    icon: <MdSettings className={`${iconStyle}`} />,
  },
];
export default routes;
