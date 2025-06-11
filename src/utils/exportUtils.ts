
import { Database } from '@/types/database';

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
