import { PrismaClient } from '@prisma/client';
import { WhatsAppDomainService } from '../../domain/services/whatsappService';

const prisma = new PrismaClient();

async function normalizeAllClientPhones() {
  console.log('🔄 Auditando y normalizando números telefónicos en Supabase Cloud...');

  const clients = await prisma.client.findMany();
  let updatedCount = 0;

  for (const client of clients) {
    const normalized = WhatsAppDomainService.normalizePhone(client.phone);
    if (normalized !== client.phone) {
      await prisma.client.update({
        where: { id: client.id },
        data: { phone: normalized },
      });
      console.log(`✨ [${client.clientKey}] ${client.name}: ${client.phone} -> ${normalized}`);
      updatedCount++;
    }
  }

  console.log(`✅ ¡Normalización completada!`);
  console.log(`📈 Se limpiaron ${updatedCount} números telefónicos (removiendo el prefijo 57 extra).`);

  await prisma.$disconnect();
}

normalizeAllClientPhones().catch((err) => {
  console.error('❌ Error durante la normalización:', err);
  prisma.$disconnect();
});
