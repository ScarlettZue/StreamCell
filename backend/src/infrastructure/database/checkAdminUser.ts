import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
  const users = await prisma.user.findMany();
  console.log('Usuarios en la base de datos:', users);
  await prisma.$disconnect();
}

checkAdmin();
