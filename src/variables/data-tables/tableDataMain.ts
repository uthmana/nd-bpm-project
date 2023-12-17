type RowObj = {
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

const tableDataMain: RowObj[] = [
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

export default tableDataMain;
