import * as XLSX from 'xlsx';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importClients() {
  console.log('🚀 Iniciando importación de Clientes desde Excel a Supabase Cloud...');
  const excelPath = path.resolve(__dirname, '../../../../docs/Plataformas Streaming, archivo base.xlsm');
  const workbook = XLSX.readFile(excelPath);

  const clientsMap = new Map<string, { name: string; phone: string }>();

  // 1. Procesar Hoja 'Registro'
  if (workbook.Sheets['Registro']) {
    const registroData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets['Registro']);
    registroData.forEach((row) => {
      const rawName = row['Cliente'] || row['cliente'] || row['CLIENTE'];
      const rawPhone = row['Numero celular '] || row['Numero celular'] || row['Celular'] || row['celular'];

      if (rawName && typeof rawName === 'string') {
        const name = rawName.trim();
        let phone = rawPhone ? String(rawPhone).replace(/\s+/g, '').trim() : '';

        if (name && name.length > 1 && !clientsMap.has(name.toLowerCase())) {
          clientsMap.set(name.toLowerCase(), { name, phone: phone || '3000000000' });
        }
      }
    });
  }

  // 2. Procesar Hojas de Plataformas
  const platformSheets = ['Netflix', 'PrimeVideo', 'DisneyP', 'MAX', 'Spotify'];
  platformSheets.forEach((sheetName) => {
    if (workbook.Sheets[sheetName]) {
      const rows: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      rows.forEach((row) => {
        Object.keys(row).forEach((col) => {
          if (col.toLowerCase().includes('perfil')) {
            const clientName = String(row[col]).trim();
            if (
              clientName &&
              clientName.length > 2 &&
              !clientName.toLowerCase().includes('empty') &&
              !clientsMap.has(clientName.toLowerCase())
            ) {
              clientsMap.set(clientName.toLowerCase(), { name: clientName, phone: '3000000000' });
            }
          }
        });
      });
    }
  });

  console.log(`📊 Se encontraron ${clientsMap.size} clientes únicos en el Excel.`);

  // Cargar clientes existentes en Supabase
  const existingClients = await prisma.client.findMany({ select: { name: true } });
  const existingNames = new Set(existingClients.map((c) => c.name.toLowerCase()));

  const clientsToInsert: Array<{ clientKey: string; name: string; phone: string; totalDebt: number }> = [];
  let currentNum = existingClients.length + 1;

  for (const clientData of clientsMap.values()) {
    if (!existingNames.has(clientData.name.toLowerCase())) {
      const clientKey = `CLI-${String(currentNum).padStart(4, '0')}`;
      clientsToInsert.push({
        clientKey,
        name: clientData.name,
        phone: clientData.phone,
        totalDebt: 0,
      });
      currentNum++;
    }
  }

  if (clientsToInsert.length > 0) {
    console.log(`⏳ Insertando ${clientsToInsert.length} nuevos clientes en Supabase...`);
    await prisma.client.createMany({
      data: clientsToInsert,
      skipDuplicates: true,
    });
  }

  const finalCount = await prisma.client.count();
  console.log(`✅ ¡Importación masiva completada!`);
  console.log(`✨ Clientes insertados: ${clientsToInsert.length}`);
  console.log(`📈 Total de clientes en tu base de datos Supabase: ${finalCount}`);

  await prisma.$disconnect();
}

importClients().catch((err) => {
  console.error('❌ Error durante la importación:', err);
  prisma.$disconnect();
});
