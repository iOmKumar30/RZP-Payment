// utils/excel.js
const ExcelJS = require("exceljs");

exports.buildExcel = (rows) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Donations");

  if (!rows.length) return workbook.xlsx.writeBuffer(); // empty file


  const columns = Object.keys(rows[0]).map((key) => ({ header: key, key }));
  sheet.columns = columns;

  rows.forEach((row) => {
    sheet.addRow(row);
  });


  sheet.getRow(1).font = { bold: true };

  return workbook.xlsx.writeBuffer(); 
};
