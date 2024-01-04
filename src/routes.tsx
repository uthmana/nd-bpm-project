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
} from 'react-icons/md';

const iconStyle = 'h-6 w-6 !hover:text-[black] dark:!hover:text-white';

const routes = [
  {
    name: 'Panel',
    layout: '/admin',
    path: 'dashboard',
    role: 'normal',
    icon: <MdHome className={`${iconStyle}`} />,
  },
  {
    name: 'Müşteri',
    layout: '/admin',
    path: 'customer',
    role: 'normal',
    icon: <MdOutlineGroups3 className={`${iconStyle}`} />,
  },
  {
    name: 'Stok',
    layout: '/admin',
    path: 'stock',
    role: 'normal',
    icon: <MdOutlineMultilineChart className={`${iconStyle}`} />,
  },

  {
    name: 'Ürün Girişi',
    layout: '/admin',
    path: 'entry',
    role: 'normal',
    icon: <MdOutlineBusiness className={`${iconStyle}`} />,
  },
  {
    name: 'Proses',
    layout: '/admin',
    path: 'process',
    role: 'normal',
    icon: <MdGroupWork className={`${iconStyle}`} />,
  },
  {
    name: 'İrsalye',
    layout: '/admin',
    path: 'invoice',
    role: 'normal',
    icon: <MdTaskAlt className={`${iconStyle}`} />,
  },
  {
    name: 'Tekif',
    layout: '/admin',
    path: 'offer',
    role: 'admin',
    icon: <MdLocalOffer className={`${iconStyle}`} />,
  },
  {
    name: 'Kullanıcılar',
    layout: '/admin',
    path: 'users',
    role: 'admin',
    icon: <MdPerson className={`${iconStyle}`} />,
  },
  {
    name: 'Ayarlar',
    layout: '/admin',
    path: 'settings',
    role: 'admin',
    icon: <MdSettings className={`${iconStyle}`} />,
  },
];
export default routes;
