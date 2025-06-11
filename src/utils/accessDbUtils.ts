
import { Buffer } from 'buffer';
import MDBReader from 'mdb-reader';
import * as XLSX from 'xlsx';
import { Database, Table, Column, ColumnType } from '@/types/database';

// Make Buffer available globally for mdb-reader dependencies
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

const ACCESS_MIME_TYPES = [
  'application/msaccess',
  'application/x-msaccess',
  'application/vnd.ms-access',
  'application/mdb',
  'application/x-mdb'
];

const EXCEL_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'
];

export const validateAccessFile = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > 50 * 1024 * 1024) { // 50MB limit for database files
    return { isValid: false, error: 'Database file must be less than 50MB' };
  }
  
  const extension = file.name.toLowerCase();
  if (!extension.endsWith('.mdb') && !extension.endsWith('.accdb') && !extension.endsWith('.xlsx')) {
    return { isValid: false, error: 'File must have a .mdb, .accdb, or .xlsx extension' };
  }
  
  return { isValid: true };
};

export const readAccessDatabase = async (file: File): Promise<Database> => {
  const extension = file.name.toLowerCase();
  
  if (extension.endsWith('.xlsx')) {
    return readExcelDatabase(file);
  } else {
    return readMDBDatabase(file);
  }
};

const readExcelDatabase = async (file: File): Promise<Database> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  const tables: Table[] = [];
  
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length === 0) continue;
    
    // First row as headers
    const headers = jsonData[0] as string[];
    const dataRows = jsonData.slice(1);
    
    if (headers.length === 0) continue;
    
    // Create columns based on headers and infer types from data
    const columns: Column[] = headers.map((header, index) => {
      let columnType: ColumnType = 'text';
      
      // Infer type from first few non-empty values
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
    
    // Convert rows to our format
    const rows = dataRows.map((row, rowIndex) => {
      const rowData: Record<string, any> = { id: rowIndex + 1 };
      columns.forEach((col, colIndex) => {
        const value = (row as any[])[colIndex];
        
        // Handle Excel date values
        if (col.type === 'date' && typeof value === 'number') {
          // Excel date serial number to JS Date
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

const readMDBDatabase = async (file: File): Promise<Database> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mdb = new MDBReader(buffer);
  
  const tableNames = mdb.getTableNames();
  const tables: Table[] = [];
  
  for (const tableName of tableNames) {
    // Skip system tables
    if (tableName.startsWith('MSys') || tableName.startsWith('~')) {
      continue;
    }
    
    const mdbTable = mdb.getTable(tableName);
    const columns: Column[] = [];
    
    // Get column data from the first row if available, or use getColumns if available
    const tableData = mdbTable.getData();
    const columnNames = mdbTable.getColumnNames();
    
    // Create columns based on available column names
    columnNames.forEach((colName, index) => {
      // Try to infer type from first data row
      let columnType: ColumnType = 'text';
      if (tableData.length > 0) {
        const firstValue = tableData[0][colName];
        columnType = inferColumnType(firstValue);
      }
      
      columns.push({
        id: `col_${index}`,
        name: colName,
        type: columnType,
        nullable: true,
        primaryKey: false,
        unique: false,
        autoIncrement: false,
        defaultValue: null,
      });
    });
    
    // Convert Access rows to our format
    const rows = tableData.map((row, rowIndex) => {
      const rowData: Record<string, any> = { id: rowIndex + 1 };
      columns.forEach(col => {
        rowData[col.name] = row[col.name] ?? null;
      });
      return rowData;
    });
    
    tables.push({
      id: Date.now().toString() + '_' + tableName,
      name: tableName,
      columns,
      rows,
    });
  }
  
  return {
    id: Date.now().toString(),
    name: file.name.replace(/\.(mdb|accdb)$/i, ''),
    tables,
  };
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
  
  // Check if string looks like a date
  if (typeof value === 'string' && !isNaN(Date.parse(value))) {
    return 'date';
  }
  
  return 'text';
};

// Export database as Excel workbook with each table as a worksheet
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
      
      // Create worksheet data
      const worksheetData: any[][] = [];
      
      // Add headers
      const headers = table.columns.map(col => col.name || 'Unnamed Column');
      worksheetData.push(headers);
      
      // Add rows
      if (table.rows && table.rows.length > 0) {
        table.rows.forEach(row => {
          const rowData = table.columns.map(col => {
            const value = row[col.name];
            // Handle different data types for Excel
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
      
      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Set column widths
      const columnWidths = headers.map(header => ({ 
        width: Math.max(String(header).length, 15) 
      }));
      worksheet['!cols'] = columnWidths;
      
      // Add worksheet to workbook with table name as sheet name
      // Excel sheet names have restrictions, so we'll clean the name
      let sheetName = table.name || `Table${index + 1}`;
      sheetName = sheetName.replace(/[\\\/\?\*\[\]:]/g, '_').substring(0, 31);
      
      // Ensure unique sheet names
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
    // Write workbook to buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    console.log('Excel export completed successfully');
    
    return excelBuffer.buffer || excelBuffer;
  } catch (error) {
    console.error('Error in exportToExcelFormat:', error);
    throw new Error(`Failed to create Excel file: ${(error as Error).message}`);
  }
};

// Export database as JSON format that can be properly imported later
export const exportToJsonFormat = (database: Database): string => {
  const exportData = {
    name: database.name,
    exported: new Date().toISOString(),
    tables: database.tables.map(table => ({
      name: table.name,
      columns: table.columns,
      rows: table.rows
    }))
  };
  
  return JSON.stringify(exportData, null, 2);
};

// Keep the old function name for backwards compatibility
export const exportToAccessFormat = (database: Database): string => {
  return exportToJsonFormat(database);
};

const mapColumnTypeToAccessType = (columnType: ColumnType): string => {
  switch (columnType) {
    case 'text':
    case 'varchar':
      return 'TEXT(255)';
    case 'number':
      return 'LONG';
    case 'decimal':
      return 'CURRENCY';
    case 'boolean':
      return 'YESNO';
    case 'date':
      return 'DATETIME';
    case 'uuid':
      return 'TEXT(36)';
    default:
      return 'TEXT(255)';
  }
};

// Create a basic Access-compatible MDB structure
export const createAccessDatabase = (database: Database): ArrayBuffer => {
  // Since we can't create actual .mdb files in the browser without a full Access engine,
  // we'll create a simplified binary format that contains the database structure and data
  // This is a simplified approach - in a real implementation, you'd need a full MDB writer
  
  const encoder = new TextEncoder();
  const header = `-- Microsoft Access Database Export\n-- Database: ${database.name}\n-- Generated: ${new Date().toISOString()}\n\n`;
  
  let content = header;
  
  for (const table of database.tables) {
    content += `-- Table: ${table.name}\n`;
    content += `CREATE TABLE [${table.name}] (\n`;
    
    const columnDefs = table.columns.map(col => {
      let def = `  [${col.name}] ${mapColumnTypeToAccessType(col.type)}`;
      if (col.primaryKey) def += ' PRIMARY KEY';
      if (!col.nullable) def += ' NOT NULL';
      if (col.autoIncrement) def += ' AUTOINCREMENT';
      return def;
    });
    
    content += columnDefs.join(',\n');
    content += '\n);\n\n';
    
    // Insert data
    if (table.rows.length > 0) {
      const columnNames = table.columns.map(col => `[${col.name}]`).join(', ');
      content += `INSERT INTO [${table.name}] (${columnNames}) VALUES\n`;
      
      const values = table.rows.map(row => {
        const rowValues = table.columns.map(col => {
          const value = row[col.name];
          if (value === null || value === undefined) return 'NULL';
          if (col.type === 'text' || col.type === 'varchar') return `'${String(value).replace(/'/g, "''")}'`;
          if (col.type === 'date') return `#${value}#`;
          return String(value);
        });
        return `  (${rowValues.join(', ')})`;
      });
      
      content += values.join(',\n');
      content += ';\n\n';
    }
  }
  
  // Convert to ArrayBuffer
  return encoder.encode(content).buffer;
};
