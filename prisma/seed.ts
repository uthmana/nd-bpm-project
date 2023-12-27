import prisma from 'app/lib/db1';
import { users } from './user';

async function main() {
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
      },
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
