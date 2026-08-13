import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findIncompleteClients() {
  const clients = await prisma.client.findMany({
    orderBy: { clientKey: 'asc' },
  });

  const missingPhone: Array<{ key: string; name: string; date: string }> = [];
  const defaultPhoneValue = '3000000000';

  clients.forEach((c) => {
    if (!c.phone || c.phone === defaultPhoneValue || c.phone.trim().length < 7) {
      missingPhone.push({
        key: c.clientKey,
        name: c.name,
        date: c.createdAt.toISOString().split('T')[0],
      });
    }
  });

  console.log(`\n📋 TOTAL DE CLIENTES EN LA BASE DE DATOS: ${clients.length}`);
  console.log(`⚠️ CLIENTES SIN NÚMERO CELULAR REGISTRADO (${missingPhone.length}):\n`);

  missingPhone.forEach((item, idx) => {
    console.log(`${idx + 1}. [${item.key}] ${item.name} | Fecha Inicio: ${item.date}`);
  });

  await prisma.$disconnect();
}

findIncompleteClients().catch((err) => {
  console.error(err);
  prisma.$disconnect();
});
