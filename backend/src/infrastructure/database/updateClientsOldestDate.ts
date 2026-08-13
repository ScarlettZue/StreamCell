import * as XLSX from 'xlsx';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function parseExcelDate(val: any): Date | null {
  if (val === undefined || val === null || val === '') return null;

  if (typeof val === 'number') {
    const date = new Date(Math.round((val - 25569) * 86400 * 1000));
    return isNaN(date.getTime()) ? null : date;
  }

  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }

  if (typeof val === 'string') {
    const trimmed = val.trim();
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) return parsed;

    const parts = trimmed.split(/[/.-]/);
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (year > 1900 && month >= 0 && month < 12 && day > 0 && day <= 31) {
        return new Date(year, month, day);
      }
    }
  }

  return null;
}

async function updateClientsOldestDate() {
  console.log('📅 Leyendo fechas de inicio desde el Excel base...');
  const excelPath = path.resolve(__dirname, '../../../../docs/Plataformas Streaming, archivo base.xlsm');
  const workbook = XLSX.readFile(excelPath);

  const clientDatesMap = new Map<string, Date[]>();

  if (workbook.Sheets['Registro']) {
    const registroData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets['Registro']);
    registroData.forEach((row) => {
      const rawName = row['Cliente'] || row['cliente'] || row['CLIENTE'];
      const rawStartDate = row['Fecha Inicio'] || row['FECHA INICIO'] || row['fecha inicio'] || row['Fecha inicio'];

      if (rawName && typeof rawName === 'string') {
        const nameKey = rawName.trim().toLowerCase();
        const parsedDate = parseExcelDate(rawStartDate);

        if (parsedDate) {
          if (!clientDatesMap.has(nameKey)) {
            clientDatesMap.set(nameKey, []);
          }
          clientDatesMap.get(nameKey)!.push(parsedDate);
        }
      }
    });
  }

  console.log(`📊 Se recolectaron fechas de inicio para ${clientDatesMap.size} clientes.`);

  const dbClients = await prisma.client.findMany();
  let updatedCount = 0;

  for (const client of dbClients) {
    const dates = clientDatesMap.get(client.name.toLowerCase());
    if (dates && dates.length > 0) {
      const oldestDate = dates.reduce((min, curr) => (curr.getTime() < min.getTime() ? curr : min), dates[0]);
      try {
        await prisma.client.update({
          where: { id: client.id },
          data: { createdAt: oldestDate },
        });
        updatedCount++;
      } catch (err) {
        // Ignorar si hay error puntual de red
      }
    }
  }

  console.log(`✅ ¡Actualización de fechas completada!`);
  console.log(`✨ Se actualizó la fecha de registro (createdAt) para ${updatedCount} clientes en Supabase Cloud.`);

  await prisma.$disconnect();
}

updateClientsOldestDate().catch((err) => {
  console.error('❌ Error durante la actualización de fechas:', err);
  prisma.$disconnect();
});
