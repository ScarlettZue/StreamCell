import * as XLSX from 'xlsx';
import path from 'path';

const excelPath = path.resolve(__dirname, '../../../../docs/Plataformas Streaming, archivo base.xlsm');
const workbook = XLSX.readFile(excelPath, { cellDates: true });

const sheet = workbook.Sheets['Registro'];
const rows: any[] = XLSX.utils.sheet_to_json(sheet, { raw: true });

console.log('Total filas en Registro:', rows.length);
console.log('Claves de la primera fila:', Object.keys(rows[0]));

console.log('\n--- Primeras 10 filas ---');
rows.slice(0, 10).forEach((r, idx) => {
  console.log(`Fila ${idx + 1}:`, {
    Cliente: r['Cliente'],
    Celular: r['Numero celular '],
    FechaInicioRaw: r['Fecha Inicio'],
    FechaInicioType: typeof r['Fecha Inicio'],
    ProximaFecha: r['Proxima Fecha'],
  });
});
