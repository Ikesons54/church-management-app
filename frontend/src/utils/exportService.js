import * as XLSX from 'xlsx';
import moment from 'moment';

export const exportToExcel = (data, filename = 'export') => {
  try {
    // Handle multiple sheets if data is an object
    if (typeof data === 'object' && !Array.isArray(data)) {
      const workbook = XLSX.utils.book_new();
      
      Object.entries(data).forEach(([sheetName, sheetData]) => {
        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });

      // Generate filename with timestamp
      const timestampedFilename = `${filename}_${moment().format('YYYY-MM-DD_HH-mm')}`;
      XLSX.writeFile(workbook, `${timestampedFilename}.xlsx`);
    } 
    // Handle single sheet if data is an array
    else if (Array.isArray(data)) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      
      const timestampedFilename = `${filename}_${moment().format('YYYY-MM-DD_HH-mm')}`;
      XLSX.writeFile(workbook, `${timestampedFilename}.xlsx`);
    }
    else {
      throw new Error('Invalid data format for export');
    }

    return true;
  } catch (error) {
    console.error('Export error:', error);
    throw new Error('Failed to export data: ' + error.message);
  }
};

export const importFromExcel = async (file) => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Failed to parse Excel file: ' + error.message));
        }
      };
      
      reader.onerror = (error) => {
        reject(new Error('Failed to read file: ' + error.message));
      };
      
      reader.readAsArrayBuffer(file);
    });
  } catch (error) {
    console.error('Import error:', error);
    throw new Error('Failed to import data: ' + error.message);
  }
}; 