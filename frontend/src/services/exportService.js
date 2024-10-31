import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from 'moment';
import Papa from 'papaparse';

export class ExportService {
  static async exportToExcel(data, filename, options = {}) {
    try {
      const wb = XLSX.utils.book_new();
      
      // Handle multiple sheets if data is an object
      if (typeof data === 'object' && !Array.isArray(data)) {
        Object.entries(data).forEach(([sheetName, sheetData]) => {
          const ws = XLSX.utils.json_to_sheet(sheetData);
          XLSX.utils.book_append_sheet(wb, ws, sheetName);
        });
      } else {
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      }

      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      saveAs(dataBlob, `${filename}.xlsx`);
      return true;
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }

  static async exportToCSV(data, filename) {
    try {
      const csv = Papa.unparse(data);
      const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `${filename}.csv`);
      return true;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  }

  static async exportToPDF(data, filename, template) {
    try {
      const pdfDoc = await template(data);
      const pdfBlob = await pdfDoc.save();
      saveAs(pdfBlob, `${filename}.pdf`);
      return true;
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw error;
    }
  }
}

export class ImportService {
  static async importFromExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const result = {};
          workbook.SheetNames.forEach(sheetName => {
            result[sheetName] = XLSX.utils.sheet_to_json(
              workbook.Sheets[sheetName]
            );
          });
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

  static async importFromCSV(file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results) => {
          resolve(results.data);
        },
        header: true,
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  static validateImportData(data, schema) {
    const errors = [];
    const validData = [];

    data.forEach((record, index) => {
      const recordErrors = [];

      // Check required fields
      Object.entries(schema).forEach(([field, rules]) => {
        if (rules.required && !record[field]) {
          recordErrors.push(`Missing required field: ${field}`);
        }

        if (record[field] && rules.type) {
          // Validate data types
          switch (rules.type) {
            case 'date':
              if (!moment(record[field]).isValid()) {
                recordErrors.push(`Invalid date format for field: ${field}`);
              }
              break;
            case 'number':
              if (isNaN(record[field])) {
                recordErrors.push(`Invalid number format for field: ${field}`);
              }
              break;
            case 'enum':
              if (!rules.values.includes(record[field])) {
                recordErrors.push(`Invalid value for field: ${field}`);
              }
              break;
          }
        }
      });

      if (recordErrors.length > 0) {
        errors.push({
          row: index + 1,
          errors: recordErrors
        });
      } else {
        validData.push(record);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      validData
    };
  }
} 