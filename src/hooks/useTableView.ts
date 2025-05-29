
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createFileInput, readFile, parseCSV, csvToTable, tableToCSV } from '@/utils/fileUtils';
import { Table } from '@/types/database';

export function useTableView(
  table: Table | null,
  onImportTable: (tableData: Table) => void
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

  const handleExportTable = async () => {
    if (!table) return;

    try {
      const csvData = tableToCSV(table);
      
      // Create a file handle using the File System Access API
      if ('showSaveFilePicker' in window) {
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: `${table.name}.csv`,
          types: [
            {
              description: 'CSV files',
              accept: {
                'text/csv': ['.csv'],
              },
            },
          ],
        });

        const writable = await fileHandle.createWritable();
        await writable.write(csvData);
        await writable.close();

        toast({
          title: "Table Exported",
          description: `Successfully exported ${table.name} to your chosen location`,
        });
      } else {
        // Fallback for browsers that don't support File System Access API
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${table.name}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Table Exported",
          description: `Successfully exported ${table.name} as CSV`,
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast({
          title: "Export Failed",
          description: "Failed to export table data.",
          variant: "destructive",
        });
      }
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
