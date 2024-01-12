// excelExport.js
import ExcelJS from 'exceljs';

const exportToExcel = (headers, data, fileName, sheetName) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Agregar encabezados
  worksheet.addRow(headers);

  // Agregar datos
  data.forEach(row => {
    worksheet.addRow(row);
  });

  // Guardar el archivo Excel
  return workbook.xlsx.writeBuffer();
};

export default exportToExcel;
