// create-admin.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const admin = await prisma.restaurant.create({
      data: {
        name: 'Admin',
        email: 'admin@mail.com',
        password: '123',
      },
    });
    console.log('✅ Admin yaradıldı:', admin);
  } catch (error) {
    console.error('❌ Xəta baş verdi:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();