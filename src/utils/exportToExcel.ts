import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
export const exportToExcel = (tableData, fileName = 'table-data.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(tableData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Write workbook and convert to blob
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(data, fileName);
};
