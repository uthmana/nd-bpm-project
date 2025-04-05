import { $Enums } from '@prisma/client';
export const password =
  '$2a$12$OZYpin2CLL917K7AaN788.cVMtU.yt.LIw0kOwU91SNcoaKhZlh/i'; // password123

export const users = [
  {
    name: 'Admin',
    email: 'admin@mail.com',
    password: password,
    role: $Enums.UserRole.ADMIN,
    contactNumber: '(555) 555 55 52',
  },
  {
    name: 'Normal',
    email: 'normal@mail.com',
    password: password,
    role: $Enums.UserRole.NORMAL,
    contactNumber: '(555) 555 55 53',
  },
  {
    name: 'Super',
    email: 'super@mail.com',
    password: password,
    role: $Enums.UserRole.SUPER,
    contactNumber: '(555) 555 55 54',
  },
  {
    name: 'Tech',
    email: 'tech@mail.com',
    password: password,
    role: $Enums.UserRole.TECH,
    contactNumber: '(555) 555 55 55',
  },
];
