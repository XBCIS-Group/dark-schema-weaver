
import * as XLSX from 'xlsx';
import { Database, Table, Column, ColumnType } from '@/types/database';

export const readExcelDatabase = async (file: File): Promise<Database> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  const tables: Table[] = [];
  
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length === 0) continue;
    
    const headers = jsonData[0] as string[];
    const dataRows = jsonData.slice(1);
    
    if (headers.length === 0) continue;
    
    const columns: Column[] = headers.map((header, index) => {
      let columnType: ColumnType = 'text';
      
      for (const row of dataRows.slice(0, 10)) {
        const value = (row as any[])[index];
        if (value !== null && value !== undefined && value !== '') {
          columnType = inferColumnType(value);
          break;
        }
      }
      
      return {
        id: `col_${index}`,
        name: String(header || `Column${index + 1}`),
        type: columnType,
        nullable: true,
        primaryKey: false,
        unique: false,
        autoIncrement: false,
        defaultValue: null,
      };
    });
    
    const rows = dataRows.map((row, rowIndex) => {
      const rowData: Record<string, any> = { id: rowIndex + 1 };
      columns.forEach((col, colIndex) => {
        const value = (row as any[])[colIndex];
        
        if (col.type === 'date' && typeof value === 'number') {
          const excelDate = XLSX.SSF.parse_date_code(value);
          if (excelDate) {
            rowData[col.name] = new Date(excelDate.y, excelDate.m - 1, excelDate.d).toISOString().split('T')[0];
          } else {
            rowData[col.name] = value;
          }
        } else {
          rowData[col.name] = value ?? null;
        }
      });
      return rowData;
    });
    
    tables.push({
      id: Date.now().toString() + '_' + sheetName + '_' + Math.random(),
      name: sheetName,
      columns,
      rows,
    });
  }
  
  return {
    id: Date.now().toString(),
    name: file.name.replace(/\.(xlsx)$/i, ''),
    tables,
  };
};

export const exportToExcelFormat = (database: Database): ArrayBuffer => {
  try {
    console.log('Creating Excel workbook for database:', database.name);
    const workbook = XLSX.utils.book_new();
    
    if (!database.tables || database.tables.length === 0) {
      throw new Error('Database has no tables to export');
    }
    
    database.tables.forEach((table, index) => {
      console.log(`Processing table ${index + 1}/${database.tables.length}: ${table.name}`);
      
      if (!table.columns || table.columns.length === 0) {
        console.warn(`Table ${table.name} has no columns, skipping`);
        return;
      }
      
      const worksheetData: any[][] = [];
      const headers = table.columns.map(col => col.name || 'Unnamed Column');
      worksheetData.push(headers);
      
      if (table.rows && table.rows.length > 0) {
        table.rows.forEach(row => {
          const rowData = table.columns.map(col => {
            const value = row[col.name];
            if (value === null || value === undefined) return '';
            if (col.type === 'date' && value) {
              try {
                return new Date(value);
              } catch {
                return value;
              }
            }
            if (col.type === 'number' || col.type === 'decimal') {
              const numValue = Number(value);
              return isNaN(numValue) ? value : numValue;
            }
            return value;
          });
          worksheetData.push(rowData);
        });
      }
      
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const columnWidths = headers.map(header => ({ 
        width: Math.max(String(header).length, 15) 
      }));
      worksheet['!cols'] = columnWidths;
      
      let sheetName = table.name || `Table${index + 1}`;
      sheetName = sheetName.replace(/[\\\/\?\*\[\]:]/g, '_').substring(0, 31);
      
      let finalSheetName = sheetName;
      let counter = 1;
      while (workbook.Sheets[finalSheetName]) {
        finalSheetName = `${sheetName.substring(0, 28)}_${counter}`;
        counter++;
      }
      
      XLSX.utils.book_append_sheet(workbook, worksheet, finalSheetName);
      console.log(`Added worksheet: ${finalSheetName}`);
    });
    
    console.log('Writing Excel file to buffer');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    console.log('Excel export completed successfully');
    
    return excelBuffer.buffer || excelBuffer;
  } catch (error) {
    console.error('Error in exportToExcelFormat:', error);
    throw new Error(`Failed to create Excel file: ${(error as Error).message}`);
  }
};

const inferColumnType = (value: any): ColumnType => {
  if (value === null || value === undefined) {
    return 'text';
  }
  
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'number' : 'decimal';
  }
  
  if (typeof value === 'boolean') {
    return 'boolean';
  }
  
  if (value instanceof Date) {
    return 'date';
  }
  
  if (typeof value === 'string' && !isNaN(Date.parse(value))) {
    return 'date';
  }
  
  return 'text';
};
