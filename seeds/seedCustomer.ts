import fs from 'fs';
import csvParser from 'csv-parser';
import prisma from 'app/lib/db';
import { $Enums, Prisma } from '@prisma/client';

async function seedDatabase() {
  const csvData = [];

  fs.createReadStream('prisma/ND_Customers.csv', { encoding: 'utf-8' })
    .pipe(csvParser({ separator: ',' }))
    .on('data', (row) => {
      csvData.push(row);
    })
    .on('end', async () => {
      const headers = Object.keys(csvData[0]);

      for (const row of csvData) {
        const data1: Partial<Prisma.CustomerCreateInput> = {
          company_name: '',
        };

        headers.forEach((header) => {
          if (header.trim() === 'cardType') {
            data1[header.trim()] =
              $Enums.CardType[row[header.trim()] as keyof $Enums.CardType];
          } else {
            data1[header.trim()] = row[header.trim()];
          }
        });
        console.log({ ...data1 });
        await prisma.customer.create({
          data: { ...data1, Offers: {} } as Prisma.CustomerCreateInput,
        });
      }

      console.log('Data seeded successfully.');
      await prisma.$disconnect();
    });
}

seedDatabase();
