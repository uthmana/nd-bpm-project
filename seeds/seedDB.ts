import fs from 'fs';
import csvParser from 'csv-parser';
import prisma from 'app/lib/db';
import { users } from './users';
import { machines } from './machines';
import { $Enums, Prisma } from '@prisma/client';

async function Users() {
  for (let i = 0; i < users.length; i++) {
    await prisma.user.upsert({
      where: { email: users[i].email },
      update: { email: users[i].email },
      create: {
        name: users[i].name,
        password: users[i].password,
        role: users[i].role,
        email: users[i].email,
        address: {},
        contactInfo: {},
        createdAt: new Date(),
      },
    });
  }
}

// async function Machines() {
//   for (let i = 0; i < machines.length; i++) {
//     await prisma.user.upsert({
//       create: {

//         createdAt: new Date(),
//       },
//     });
//   }
// }

async function Customers() {
  const csvData = [];

  fs.createReadStream('seeds/ND_Customers.csv', { encoding: 'utf-8' })
    .pipe(csvParser({ separator: ',' }))
    .on('data', (row) => {
      csvData.push(row);
    })
    .on('end', async () => {
      const headers = Object.keys(csvData[0]);

      for (const row of csvData) {
        const data1: Partial<Prisma.CustomerCreateInput> = {};

        headers.forEach((header) => {
          const trimmedHeader = header.trim();
          switch (trimmedHeader) {
            case 'code':
              data1[trimmedHeader] = row[header];
              // const company_name = row['company_name'] || '';
              // const firstChar = company_name[0].toUpperCase() || '';
              // const secondCharAfterSpace = company_name.split(' ')[-1]?.toUpperCase() || '';
              // const codeLength = company_name.length.toString();
              // data1[trimmedHeader] = `${firstChar}${secondCharAfterSpace}${codeLength}`;
              break;
            case 'cardType':
              data1[trimmedHeader] =
                $Enums.CardType[row[trimmedHeader] as keyof $Enums.CardType] ||
                $Enums.CardType.ALICI_SATICI;
              break;
            case 'Offers':
              data1[trimmedHeader] = {}; // Assuming Offers is an object
              break;
            default:
              data1[trimmedHeader] = row[trimmedHeader];
              break;
          }
        });

        console.log({ ...data1 });

        await prisma.customer.create({
          data: { ...data1 } as Prisma.CustomerCreateInput,
        });
      }

      console.log('Data seeded successfully.');
      await prisma.$disconnect();
    });
}

Users()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

Customers();
