
import { useToast } from '@/hooks/use-toast';
import { createFileInput } from '@/utils/fileUtils';
import { validateAccessFile, readAccessDatabase, exportToExcelFormat } from '@/utils/accessDbUtils';
import { Database } from '@/types/database';

export function useDatabaseImportExport() {
  const { toast } = useToast();

  const importDatabase = async (): Promise<Database | null> => {
    try {
      const file = await createFileInput('.mdb,.accdb,.xlsx');
      if (!file) return null;

      const fileValidation = validateAccessFile(file);
      if (!fileValidation.isValid) {
        toast({
          title: "Invalid File",
          description: fileValidation.error,
          variant: "destructive",
        });
        return null;
      }

      const importedDatabase = await readAccessDatabase(file);
      
      const fileType = file.name.toLowerCase().endsWith('.xlsx') ? 'Excel workbook' : 'Access database';
      toast({
        title: `${fileType} Imported`,
        description: `Successfully imported ${importedDatabase.tables.length} tables from ${file.name}`,
      });

      return importedDatabase;
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import database file. Please check the file format.",
        variant: "destructive",
      });
      return null;
    }
  };

  const exportDatabase = async (database: Database) => {
    if (database.tables.length === 0) {
      toast({
        title: "No Tables to Export",
        description: "The selected database has no tables to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting Excel export for database:', database.name);
      
      const excelBuffer = exportToExcelFormat(database);
      console.log('Excel buffer created successfully');
      
      if ('showSaveFilePicker' in window) {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: `${database.name}.xlsx`,
            types: [
              {
                description: 'Excel Workbook',
                accept: {
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                },
              },
            ],
          });

          const writable = await fileHandle.createWritable();
          await writable.write(excelBuffer);
          await writable.close();

          toast({
            title: "Database Exported",
            description: `Successfully exported ${database.name} as Excel workbook with ${database.tables.length} worksheets`,
          });
        } catch (saveError) {
          if ((saveError as Error).name === 'AbortError') {
            return;
          }
          throw saveError;
        }
      } else {
        const blob = new Blob([excelBuffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${database.name}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Database Exported",
          description: `Successfully exported ${database.name} as Excel workbook with ${database.tables.length} worksheets`,
        });
      }
    } catch (error) {
      console.error('Excel export error:', error);
      toast({
        title: "Export Failed",
        description: `Failed to export database as Excel workbook: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  return {
    importDatabase,
    exportDatabase,
  };
}
