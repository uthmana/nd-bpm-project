// import { PrismaClient } from '@prisma/client';

// const prismaClientSingleton = () => {
//   return new PrismaClient();
// };

// declare global {
//   var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
// }

// const prisma = globalThis.prisma ?? prismaClientSingleton();

// export default prisma;

// if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

//**************************CONNECTION FOR DEVELOPMENT ****************************************************** */
import { PrismaClient } from '@prisma/client';
//const db_url = 'postgresql://postgres:mau1234@localhost:5433/postgres'; //Uthman
const db_url = 'postgresql://postgres:majeed123@localhost:5432/postgres'; //Majeed

const prismaClientSingleton = () => {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient();
  }
  return new PrismaClient({
    datasources: {
      db: { url: db_url },
    },
  });
};
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
