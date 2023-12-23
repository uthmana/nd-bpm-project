import prisma from 'app/lib/db1';
import { hash } from 'bcryptjs';

//const prisma = new PrismaClient();
// I am writt
async function main() {
  const password = await hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: 'Admin',
      password,
      address: {
        create: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
        },
      },
      contactInfo: {
        create: {
          phone: '123-456-7890',
          email: 'john@example.com',
        },
      },
    },
  });
  console.log({ user });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
