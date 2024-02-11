import { PrismaClient } from '@prisma/client';

const db_url = 'postgresql://postgres:mau1234@localhost:5433/postgres'; //Uthman
//const db_url = 'postgresql://postgres:majeed123@localhost:5432/postgres'; //Majeed
//const db_url="postgresql://postgres:159357@localhost:5432/bpms_Db?schema=public";  //Shiraz
const db_url_prod =
  'postgres://default:x0aI3JEXFvzl@ep-royal-queen-a4scbpug-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15';
const db_directUrl =
  'postgres://default:x0aI3JEXFvzl@ep-royal-queen-a4scbpug.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require';

const db_dev = {
  datasources: {
    db: { url: db_url },
  },
};

const db_prod = {
  datasources: {
    db: { url: db_url_prod, directUrl: db_directUrl },
  },
};

const prismaClientSingleton = () => {
  // if (process.env.NODE_ENV !== 'production') {
  //   return new PrismaClient(db_dev);
  // }

  // return new PrismaClient(db_prod);

  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
