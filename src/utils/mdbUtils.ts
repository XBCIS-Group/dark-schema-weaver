
import { Buffer } from 'buffer';
import MDBReader from 'mdb-reader';
import { Database, Table, Column, ColumnType } from '@/types/database';

if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

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

export const readMDBDatabase = async (file: File): Promise<Database> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mdb = new MDBReader(buffer);
  
  const tableNames = mdb.getTableNames();
  const tables: Table[] = [];
  
  for (const tableName of tableNames) {
    if (tableName.startsWith('MSys') || tableName.startsWith('~')) {
      continue;
    }
    
    const mdbTable = mdb.getTable(tableName);
    const columns: Column[] = [];
    
    const tableData = mdbTable.getData();
    const columnNames = mdbTable.getColumnNames();
    
    columnNames.forEach((colName, index) => {
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
