import React from 'react';

// Admin Imports

// Icon Imports
import {
  MdHome,
  MdPerson,
  MdOutlineLogout,
  MdGroupWork,
  MdOutlineBusiness,
  MdOutlineGroups3,
  MdOutlineMultilineChart,
  MdSettings,
  MdTaskAlt,
  MdLocalOffer,
} from 'react-icons/md';

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: 'dashboard',
    icon: <MdHome className="h-6 w-6" />,
  },
  {
    name: 'Stock',
    layout: '/admin',
    path: 'stock',
    icon: <MdOutlineMultilineChart className="h-6 w-6" />,
  },
  {
    name: 'Customers',
    layout: '/admin',
    path: 'customer',
    icon: <MdOutlineGroups3 className="h-6 w-6" />,
  },
  {
    name: 'Entry',
    layout: '/admin',
    path: 'entry',
    icon: <MdOutlineBusiness className="h-6 w-6" />,
  },
  {
    name: 'Process',
    layout: '/admin',
    path: 'process',
    icon: <MdGroupWork className="h-6 w-6" />,
  },
  {
    name: 'Invoice',
    layout: '/admin',
    path: 'invoice',
    icon: <MdTaskAlt className="h-6 w-6" />,
  },
  {
    name: 'Offer',
    layout: '/admin',
    path: 'offer',
    icon: <MdLocalOffer className="h-6 w-6" />,
  },
  {
    name: 'Users',
    layout: '/admin',
    path: 'users',
    icon: <MdPerson className="h-6 w-6" />,
  },
  {
    name: 'Settings',
    layout: '/admin',
    path: 'settings',
    icon: <MdSettings className="h-6 w-6" />,
  },
  {
    name: 'Sign Out',
    layout: '/auth',
    path: 'sign-in',
    icon: <MdOutlineLogout className="h-6 w-6" />,
  },
  {
    name: 'To do',
    layout: '/admin',
    Path: 'todo',
    icon: <MdLock className="h-6 w-6" />,
  },
];
export default routes;
