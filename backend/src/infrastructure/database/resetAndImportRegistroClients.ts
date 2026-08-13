import * as XLSX from 'xlsx';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function parseExcelCellDate(val: any): Date | null {
  if (!val) return null;

  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }

  if (typeof val === 'number') {
    // Número serial de Excel
    const date = new Date(Math.round((val - 25569) * 86400 * 1000));
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return null;
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

async function resetAndImportRegistroClients() {
  console.log('🧹 Limpiando tabla de clientes en Supabase Cloud...');

  // Eliminar tablas dependientes primero
  await prisma.profileSubscription.deleteMany({});
  await prisma.debtRecord.deleteMany({});
  await prisma.saleDetail.deleteMany({});
  await prisma.sale.deleteMany({});
  await prisma.client.deleteMany({});

  console.log('✨ Tabla de clientes reseteada a 0.');

  console.log('📂 Leyendo ÚNICAMENTE la hoja "Registro" del Excel...');
  const excelPath = path.resolve(__dirname, '../../../../docs/Plataformas Streaming, archivo base.xlsm');
  const workbook = XLSX.readFile(excelPath, { cellDates: true });

  const registroSheet = workbook.Sheets['Registro'];
  if (!registroSheet) {
    throw new Error('No se encontró la hoja "Registro" en el archivo Excel.');
  }

  const rows: any[] = XLSX.utils.sheet_to_json(registroSheet, { raw: true });
  console.log(`📊 Leídas ${rows.length} filas en la hoja Registro.`);

  // Estrutura para agrupar por cliente
  const clientGroup = new Map<
    string,
    {
      originalName: string;
      phone: string;
      dates: Date[];
    }
  >();

  rows.forEach((row) => {
    const rawName = row['Cliente'] || row['cliente'] || row['CLIENTE'];
    const rawPhone = row['Numero celular '] || row['Numero celular'] || row['Celular'] || row['celular'];
    const rawDate = row['Fecha Inicio'] || row['FECHA INICIO'] || row['fecha inicio'];

    if (rawName && typeof rawName === 'string') {
      const name = rawName.trim();
      if (name.length > 1) {
        const key = name.toLowerCase();
        let phone = rawPhone ? String(rawPhone).replace(/\s+/g, '').trim() : '';

        const parsedDate = parseExcelCellDate(rawDate);

        if (!clientGroup.has(key)) {
          clientGroup.set(key, {
            originalName: name,
            phone: phone || '3000000000',
            dates: parsedDate ? [parsedDate] : [],
          });
        } else {
          const item = clientGroup.get(key)!;
          if (phone && item.phone === '3000000000') {
            item.phone = phone;
          }
          if (parsedDate) {
            item.dates.push(parsedDate);
          }
        }
      }
    }
  });

  console.log(`👥 Total de clientes únicos encontrados exclusivamente en "Registro": ${clientGroup.size}`);

  const clientsToCreate: Array<{
    clientKey: string;
    name: string;
    phone: string;
    totalDebt: number;
    createdAt: Date;
    updatedAt: Date;
  }> = [];

  let currentNum = 1;
  const now = new Date();

  for (const item of clientGroup.values()) {
    const clientKey = `CLI-${String(currentNum).padStart(4, '0')}`;

    // Determinar la fecha de inicio más antigua leída
    let oldestDate = now;
    if (item.dates.length > 0) {
      oldestDate = item.dates.reduce((min, curr) => (curr.getTime() < min.getTime() ? curr : min), item.dates[0]);
    }

    clientsToCreate.push({
      clientKey,
      name: item.originalName,
      phone: item.phone,
      totalDebt: 0,
      createdAt: oldestDate,
      updatedAt: oldestDate,
    });

    currentNum++;
  }

  console.log(`⏳ Insertando ${clientsToCreate.length} clientes con su fecha de inicio real más antigua...`);

  // Insertar en lotes de 20 para óptimo rendimiento en Supabase
  const batchSize = 20;
  for (let i = 0; i < clientsToCreate.length; i += batchSize) {
    const batch = clientsToCreate.slice(i, i + batchSize);
    await Promise.all(
      batch.map((c) =>
        prisma.client.create({
          data: c,
        })
      )
    );
  }

  const finalCount = await prisma.client.count();
  console.log(`🎉 ¡PROCESO COMPLETADO EXITOSAMENTE!`);
  console.log(`📈 Total de clientes en Supabase: ${finalCount}`);

  // Mostrar muestra de validación
  const sample = await prisma.client.findMany({ take: 5, orderBy: { clientKey: 'asc' } });
  console.log('\n--- Muestra de Clientes Insertados con sus Fechas Reales ---');
  sample.forEach((c) => {
    console.log(`[${c.clientKey}] ${c.name} | Tel: ${c.phone} | Fecha Registro Real: ${c.createdAt.toISOString().split('T')[0]}`);
  });

  await prisma.$disconnect();
}

resetAndImportRegistroClients().catch((err) => {
  console.error('❌ Error durante el formateo e importación:', err);
  prisma.$disconnect();
});
