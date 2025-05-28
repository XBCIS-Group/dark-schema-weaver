
export interface Column {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
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
