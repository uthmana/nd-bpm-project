import fs from 'fs';
import csvParser from 'csv-parser';
import prisma from 'app/lib/db';
import { users } from './modals/users';
import { machines } from './modals/machines';
import { colors } from './modals/colors';
import { applications } from './modals/application';
import { standards } from './modals/standard';
import { $Enums, Prisma } from '@prisma/client';

//Seeding of Users from users type script file
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

// Seeding of Machines
async function Machines() {
  for (const machineData of machines) {
    try {
      const createdMachine = await prisma.machine.create({
        data: {
          machine_Name: machineData.machine_Name,
          machineParams: {
            create: machineData.machineParams.map((param) => ({
              param_name: param.param_name,
              display_name: param.display_name,
            })),
          },
        },
      });
      console.log(`Created machine with ID: ${createdMachine.id}`);
    } catch (error) {
      console.error(`Error creating machine: ${error.message}`);
    }
  }
}
// Seeding of Standards
async function Standards() {
  for (const standardData of standards) {
    try {
      await prisma.standards.create({
        data: standardData,
      });
      // console.log(`Standards "${standardData.name}" seeded successfully.`);
    } catch (error) {
      console.error(
        `Error seeding Standards "${standardData.name}": ${error.message}`,
      );
    }
  }
  console.log('Standards Data seeded successfully.');
}
// Seeding of Colors
async function Colors() {
  for (const colorData of colors) {
    try {
      await prisma.colors.create({
        data: colorData,
      });
      // console.log(`Colors "${colorData.name}" seeded successfully.`);
    } catch (error) {
      console.error(
        `Error seeding Colors "${colorData.name}": ${error.message}`,
      );
    }
  }
  console.log('Colors Data seeded successfully.');
}

// Seeding of Applicaitons
async function Applicaitons() {
  for (const applicationData of applications) {
    try {
      await prisma.applications.create({
        data: applicationData,
      });
      // console.log(`Applicaitons "${applicationData.name}" seeded successfully.`);
    } catch (error) {
      console.error(
        `Error seeding Applicaiton "${applicationData.name}": ${error.message}`,
      );
    }
  }
  console.log('Applicaitons Data seeded successfully.');
}

//Seeding for Customers from customers excell file
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
                $Enums.CardType.ALICI;
              break;
            case 'Offers':
              data1[trimmedHeader] = {}; // Assuming Offers is an object
              break;
            default:
              data1[trimmedHeader] = row[trimmedHeader];
              break;
          }
        });

        // console.log({ ...data1 });

        await prisma.customer.create({
          data: { ...data1 } as Prisma.CustomerCreateInput,
        });
      }

      console.log('Customers Data seeded successfully.');
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

Machines();

Standards();

Colors();

Applicaitons();
