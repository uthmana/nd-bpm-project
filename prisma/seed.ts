import prisma from 'app/lib/db1';
import { users } from './user';

async function main() {
  for (let user in users) {
    await prisma.user.upsert({
      where: { email: 'admin@mail.com' },
      update: {},
      create: { ...(user as any), address: {}, contactInfo: {} },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
