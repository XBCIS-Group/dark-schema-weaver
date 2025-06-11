import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createFileInput } from '@/utils/fileUtils';
import { validateAccessFile, readAccessDatabase, exportToExcelFormat } from '@/utils/accessDbUtils';
import { Database } from '@/types/database';

export function useDatabaseOperations() {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreateDatabase = (name: string) => {
    const newDatabase: Database = {
      id: Date.now().toString(),
      name,
      tables: [],
    };
    
    setDatabases(prev => [...prev, newDatabase]);
    toast({
      title: "Database Created",
      description: `Database "${name}" has been created successfully.`,
    });
  };

  const handleImportDatabase = async () => {
    try {
      const file = await createFileInput('.mdb,.accdb');
      if (!file) return;

      const fileValidation = validateAccessFile(file);
      if (!fileValidation.isValid) {
        toast({
          title: "Invalid File",
          description: fileValidation.error,
          variant: "destructive",
        });
        return;
      }

      const importedDatabase = await readAccessDatabase(file);
      
      setDatabases(prev => [...prev, importedDatabase]);
      toast({
        title: "Access Database Imported",
        description: `Successfully imported ${importedDatabase.tables.length} tables from ${file.name}`,
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import Access database. Please check the file format.",
        variant: "destructive",
      });
    }
  };

  const handleExportDatabase = async () => {
    if (!selectedDatabase) {
      toast({
        title: "No Database Selected",
        description: "Please select a database to export.",
        variant: "destructive",
      });
      return;
    }

    const database = databases.find(db => db.id === selectedDatabase);
    if (!database) {
      toast({
        title: "Database Not Found",
        description: "The selected database could not be found.",
        variant: "destructive",
      });
      return;
    }

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
      
      // Export as Excel workbook
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
            // User cancelled the save dialog
            return;
          }
          throw saveError;
        }
      } else {
        // Fallback for browsers that don't support File System Access API
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

  const handleEditDatabase = (name: string, editingDatabase: Database | null) => {
    if (!editingDatabase) return;

    setDatabases(prev => prev.map(db => 
      db.id === editingDatabase.id 
        ? { ...db, name }
        : db
    ));

    toast({
      title: "Database Updated",
      description: `Database has been renamed to "${name}".`,
    });
  };

  const handleDeleteDatabase = (id: string) => {
    const database = databases.find(db => db.id === id);
    if (database) {
      setDatabases(prev => prev.filter(db => db.id !== id));
      if (selectedDatabase === id) {
        setSelectedDatabase(null);
        setSelectedTable(null);
      }
      toast({
        title: "Database Deleted",
        description: `Database "${database.name}" has been deleted.`,
        variant: "destructive",
      });
    }
  };

  return {
    databases,
    setDatabases,
    selectedDatabase,
    setSelectedDatabase,
    selectedTable,
    setSelectedTable,
    handleCreateDatabase,
    handleImportDatabase,
    handleExportDatabase,
    handleEditDatabase,
    handleDeleteDatabase,
  };
}
