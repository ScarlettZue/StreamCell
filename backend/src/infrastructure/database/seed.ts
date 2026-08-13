import { prisma } from './prisma';
import { HashService } from '../security/hash';

async function main() {
  console.log('🌱 Iniciando carga de datos iniciales (Seed) en Supabase...');

  // 1. Crear Administradora Inicial si no existe
  const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

  if (!existingAdmin) {
    const hashedPassword = await HashService.hash('Streamcell2026*');
    const admin = await prisma.user.create({
      data: {
        email: 'admin@streamcell.com',
        password: hashedPassword,
        name: 'Administradora Streamcell',
        role: 'ADMIN',
      },
    });
    console.log('✅ Usuario Administradora creado:', admin.email);
  } else {
    console.log('ℹ️ Administradora ya existente:', existingAdmin.email);
  }

  // 2. Crear Categorías Base
  const categories = [
    { name: 'Streaming Video', description: 'Cuentas y pantallas de video (Netflix, Disney+, Prime, HBO, etc.)' },
    { name: 'Música', description: 'Servicios de streaming musical (Spotify, Apple Music)' },
    { name: 'Diseño & Software', description: 'Herramientas de diseño y productividad (Canva Pro, ChatGPT)' },
    { name: 'IPTV & TV Digital', description: 'Servicios de televisión en vivo (MagisTV, IPTV, Directv GO)' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categorías de productos inicializadas');

  console.log('🎉 Seed de Supabase completado con éxito!');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
