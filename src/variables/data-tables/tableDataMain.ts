type UserObj = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: boolean;
  date: string;
  edit: string;
  delete: string;
};

type CustomerObj = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  edit: string;
  delete: string;
};

type StockObj = {
  id: string;
  product_name: string;
  stock_location: string;
  quantity: number;
  price: string;
  description: string;
  date: string;
  vendor: string;
  edit: string;
  delete: string;
};

export const userTableData: UserObj[] = [
  {
    id: '1',
    name: 'Joe Murat',
    email: 'example@mail.com',
    password: 'Password',
    role: 'Admin',
    status: true,
    date: '12/12/2023',
    edit: '1',
    delete: '1',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'example@mail.com',
    password: 'Password',
    role: 'super',
    status: true,
    date: '12/12/2023',
    edit: '2',
    delete: '2',
  },
  {
    id: '3',
    name: 'Erdem Max',
    email: 'example@mail.com',
    password: 'Password',
    role: 'normal',
    status: true,
    date: '12/12/2023',
    edit: '3',
    delete: '3',
  },
  {
    id: '4',
    name: 'Samet Yıldırım',
    email: 'example@mail.com',
    password: 'Password',
    role: 'tech',
    status: true,
    date: '12/12/2023',
    edit: '4',
    delete: '4',
  },
];

export const customerTableData: CustomerObj[] = [
  {
    id: '1',
    first_name: 'Joe',
    last_name: 'Murat',
    email: 'example@mail.com',
    phone: '+111 111 111 11',
    address: 'Adana',
    postal_code: '33202',
    edit: '1',
    delete: '1',
  },
  {
    id: '2',
    first_name: 'Test',
    last_name: 'Oğlu',
    email: 'example@mail.com',
    phone: '+222 222 22 22',
    address: 'Ankara',
    postal_code: '33200',
    edit: '2',
    delete: '2',
  },
  {
    id: '3',
    first_name: 'Erdem',
    last_name: 'Murat',
    email: 'example@mail.com',
    phone: '+333 333 33 33',
    address: 'Istanbul',
    postal_code: '32202',
    edit: '2',
    delete: '2',
  },
  {
    id: '4',
    first_name: 'Samet',
    last_name: 'Yıldırım',
    email: 'example@mail.com',
    phone: '+444 444 44 44',
    address: 'Adana',
    postal_code: '31202',
    edit: '4',
    delete: '4',
  },
];

export const stockTableData: StockObj[] = [
  {
    id: '1',
    product_name: 'Boru',
    stock_location: 'Murat',
    quantity: 3,
    price: '100',
    description: '+111 111 111 11',
    date: '12/12/2023',
    vendor: 'koçtaş',
    edit: '1',
    delete: '1',
  },
  {
    id: '2',
    product_name: 'Boru 2',
    stock_location: 'Murat 2',
    quantity: 4,
    price: '200',
    description: 'sdf sdfgsdf sdg',
    date: '12/12/2023',
    vendor: 'koçtaş 1',
    edit: '2',
    delete: '2',
  },
  {
    id: '3',
    product_name: 'Boru 3',
    stock_location: 'Murat 3',
    quantity: 10,
    price: '150',
    description: 'sdf sdfgsdf sdg 3',
    date: '12/12/2023',
    vendor: 'koçtaş 3',
    edit: '2',
    delete: '2',
  },
  {
    id: '4',
    product_name: 'Boru 4',
    stock_location: 'Murat 4',
    quantity: 20,
    price: '250',
    description: 'sdf sdfgsdf sdg 4',
    date: '12/12/2023',
    vendor: 'koçtaş 4',
    edit: '4',
    delete: '4',
  },
];
