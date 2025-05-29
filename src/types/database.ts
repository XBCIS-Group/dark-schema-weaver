
export type ColumnType = 'text' | 'number' | 'boolean' | 'date';

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
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
