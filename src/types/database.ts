export type ColumnType = 'text' | 'varchar' | 'number' | 'decimal' | 'boolean' | 'date' | 'email' | 'url' | 'json' | 'uuid';

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
  autoIncrement: boolean;
  defaultValue?: string | null;
}

export interface Table {
  id: string;
  name: string;
  columns: Column[];
  rows: Record<string, any>[];
}

export interface Database {
  id: string;
  name: string;
  tables: Table[];
}
