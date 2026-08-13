import * as XLSX from 'xlsx';
import path from 'path';

const excelPath = path.resolve(__dirname, '../../../../docs/Plataformas Streaming, archivo base.xlsm');
console.log('Cargando Excel desde:', excelPath);

const workbook = XLSX.readFile(excelPath);
console.log('Hojas disponibles:', workbook.SheetNames);

workbook.SheetNames.forEach((sheetName) => {
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`\n--- Hoja: ${sheetName} (Filas: ${data.length}) ---`);
  if (data.length > 0) {
    console.log('Primeras 3 filas:', data.slice(0, 3));
  }
});
