
import MDBReader from 'mdb-reader';
import { Database, Table, Column, ColumnType } from '@/types/database';

const ACCESS_MIME_TYPES = [
  'application/msaccess',
  'application/x-msaccess',
  'application/vnd.ms-access',
  'application/mdb',
  'application/x-mdb'
];

export const validateAccessFile = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > 50 * 1024 * 1024) { // 50MB limit for Access files
    return { isValid: false, error: 'Access database file must be less than 50MB' };
  }
  
  const extension = file.name.toLowerCase();
  if (!extension.endsWith('.mdb') && !extension.endsWith('.accdb')) {
    return { isValid: false, error: 'File must have a .mdb or .accdb extension' };
  }
  
  return { isValid: true };
};

export const readAccessDatabase = async (file: File): Promise<Database> => {
  const arrayBuffer = await file.arrayBuffer();
  // Convert ArrayBuffer to Buffer for mdb-reader
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

export const exportToAccessFormat = (database: Database): string => {
  // Since we can't create actual .mdb files in the browser, we'll export as SQL
  // that can be imported into Access
  let sql = `-- Microsoft Access Import Script for: ${database.name}\n`;
  sql += `-- Generated on: ${new Date().toISOString()}\n\n`;
  
  for (const table of database.tables) {
    // Create table statement
    sql += `CREATE TABLE [${table.name}] (\n`;
    
    const columnDefs = table.columns.map(col => {
      let def = `  [${col.name}] ${mapColumnTypeToAccessType(col.type)}`;
      if (col.primaryKey) def += ' PRIMARY KEY';
      if (!col.nullable) def += ' NOT NULL';
      if (col.autoIncrement) def += ' AUTOINCREMENT';
      return def;
    });
    
    sql += columnDefs.join(',\n');
    sql += '\n);\n\n';
    
    // Insert data
    if (table.rows.length > 0) {
      const columnNames = table.columns.map(col => `[${col.name}]`).join(', ');
      sql += `INSERT INTO [${table.name}] (${columnNames}) VALUES\n`;
      
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
      
      sql += values.join(',\n');
      sql += ';\n\n';
    }
  }
  
  return sql;
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
