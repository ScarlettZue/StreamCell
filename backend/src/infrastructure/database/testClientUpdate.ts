import { PrismaClient } from '@prisma/client';
import { WhatsAppDomainService } from '../../domain/services/whatsappService';

const prisma = new PrismaClient();

async function testUpdate() {
  const client = await prisma.client.findFirst({
    where: { clientKey: 'CLI-0004' },
  });

  if (!client) {
    console.log('Cliente CLI-0004 no encontrado');
    return;
  }

  console.log('Cliente actual CLI-0004:', client);

  const updated = await prisma.client.update({
    where: { id: client.id },
    data: {
      name: client.name,
      phone: WhatsAppDomainService.normalizePhone('3126622931'),
    },
  });

  console.log('Cliente actualizado CLI-0004:', updated);
  await prisma.$disconnect();
}

testUpdate().catch((err) => {
  console.error('Error al actualizar:', err);
  prisma.$disconnect();
});
