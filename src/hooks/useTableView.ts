
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createFileInput, readFile, parseCSV, csvToTable, tableToCSV, downloadFile } from '@/utils/fileUtils';

interface Column {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
}

interface TableData {
  id: string;
  name: string;
  columns: Column[];
  rows: Record<string, any>[];
}

export function useTableView(
  table: TableData | null,
  onImportTable: (tableData: TableData) => void
) {
  const [filter, setFilter] = useState('');
  const { toast } = useToast();

  const handleImportTable = async () => {
    try {
      const file = await createFileInput('.csv');
      if (!file) return;

      const csvText = await readFile(file);
      const { headers, rows } = parseCSV(csvText);
      
      const tableName = file.name.replace('.csv', '');
      const newTable = csvToTable(headers, rows, tableName);
      
      onImportTable(newTable);
      toast({
        title: "Table Imported",
        description: `Successfully imported ${rows.length} rows from ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import CSV file. Please check the file format.",
        variant: "destructive",
      });
    }
  };

  const handleExportTable = () => {
    if (!table) return;

    try {
      const csvData = tableToCSV(table);
      downloadFile(csvData, `${table.name}.csv`, 'text/csv');
      toast({
        title: "Table Exported",
        description: `Successfully exported ${table.name} as CSV`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export table data.",
        variant: "destructive",
      });
    }
  };

  const filteredRows = table ? table.rows.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(filter.toLowerCase())
    )
  ) : [];

  return {
    filter,
    setFilter,
    filteredRows,
    handleImportTable,
    handleExportTable,
  };
}
