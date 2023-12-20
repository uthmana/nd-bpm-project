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
} from 'react-icons/md';

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: 'dashboard',
    role: 'normal',
    icon: <MdHome className="h-6 w-6" />,
  },
  {
    name: 'Stock',
    layout: '/admin',
    path: 'stock',
    role: 'normal',
    icon: <MdOutlineMultilineChart className="h-6 w-6" />,
  },
  {
    name: 'Customers',
    layout: '/admin',
    path: 'customer',
    role: 'normal',
    icon: <MdOutlineGroups3 className="h-6 w-6" />,
  },
  {
    name: 'Entry',
    layout: '/admin',
    path: 'entry',
    role: 'normal',
    icon: <MdOutlineBusiness className="h-6 w-6" />,
  },
  {
    name: 'Process',
    layout: '/admin',
    path: 'process',
    role: 'normal',
    icon: <MdGroupWork className="h-6 w-6" />,
  },
  {
    name: 'Invoice',
    layout: '/admin',
    path: 'invoice',
    role: 'normal',
    icon: <MdTaskAlt className="h-6 w-6" />,
  },
  {
    name: 'Offer',
    layout: '/admin',
    path: 'offer',
    role: 'admin',
    icon: <MdLocalOffer className="h-6 w-6" />,
  },
  {
    name: 'Users',
    layout: '/admin',
    path: 'users',
    role: 'admin',
    icon: <MdPerson className="h-6 w-6" />,
  },
  {
    name: 'Settings',
    layout: '/admin',
    path: 'settings',
    role: 'admin',
    icon: <MdSettings className="h-6 w-6" />,
  },
];
export default routes;
