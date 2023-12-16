import React from 'react';

// Admin Imports

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
  MdOutlineLogout,
  MdOutlineFiberManualRecord,
  MdOutlineOnDeviceTraining,
  MdEmail,
  MdGroupWork,
  MdOutlineBusiness,
  MdOutlineGroups3,
  MdBrokenImage,
  MdOutlineMultilineChart,
  MdRestore,
  MdSettings,
  MdTaskAlt,
} from 'react-icons/md';

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: 'dashboard',
    icon: <MdHome className="h-6 w-6" />,
  },
  // {
  //   name: 'NFT Marketplace',
  //   layout: '/admin',
  //   path: 'nft-marketplace',
  //   icon: <MdOutlineShoppingCart className="h-6 w-6" />,
  //   secondary: true,
  // },
  // {
  //   name: 'Data Tables',
  //   layout: '/admin',
  //   path: 'data-tables',
  //   icon: <MdBarChart className="h-6 w-6" />,
  // },
  // {
  //   name: 'Sign In',
  //   layout: '/auth',
  //   path: 'sign-in',
  //   icon: <MdLock className="h-6 w-6" />,
  // },
  {
    name: 'Profile',
    layout: '/admin',
    path: 'profile',
    icon: <MdPerson className="h-6 w-6" />,
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
    name: 'Product',
    layout: '/admin',
    path: 'product',
    icon: <MdOutlineBusiness className="h-6 w-6" />,
  },
  {
    name: 'Process',
    layout: '/admin',
    path: 'process',
    icon: <MdGroupWork className="h-6 w-6" />,
  },
  {
    name: 'Invoices',
    layout: '/admin',
    path: 'invoice',
    icon: <MdTaskAlt className="h-6 w-6" />,
  },
  {
    name: 'Email',
    layout: '/admin',
    path: 'email',
    icon: <MdEmail className="h-6 w-6" />,
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
];
export default routes;
