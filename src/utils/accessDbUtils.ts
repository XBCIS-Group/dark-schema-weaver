
import { Database, ColumnType } from '@/types/database';
import { readExcelDatabase, exportToExcelFormat } from '@/utils/excelUtils';
import { readMDBDatabase } from '@/utils/mdbUtils';

export const validateAccessFile = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > 50 * 1024 * 1024) {
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

// Re-export for compatibility
export { exportToExcelFormat };

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

export const createAccessDatabase = (database: Database): ArrayBuffer => {
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
  
  return encoder.encode(content).buffer;
};
