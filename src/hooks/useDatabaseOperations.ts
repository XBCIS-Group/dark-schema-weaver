
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createFileInput, readFile, downloadFile } from '@/utils/fileUtils';

interface Column {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
}

interface Table {
  id: string;
  name: string;
  columns: Column[];
  rows: Record<string, any>[];
}

interface Database {
  id: string;
  name: string;
  tables: Table[];
}

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
      const file = await createFileInput('.json');
      if (!file) return;

      const jsonText = await readFile(file);
      const importedData = JSON.parse(jsonText);
      
      const newDatabase: Database = {
        id: Date.now().toString(),
        name: importedData.name || file.name.replace('.json', ''),
        tables: importedData.tables || [],
      };

      setDatabases(prev => [...prev, newDatabase]);
      toast({
        title: "Database Imported",
        description: `Successfully imported database from ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import database. Please check the file format.",
        variant: "destructive",
      });
    }
  };

  const handleExportDatabase = () => {
    if (!selectedDatabase) {
      toast({
        title: "No Database Selected",
        description: "Please select a database to export.",
        variant: "destructive",
      });
      return;
    }

    const database = databases.find(db => db.id === selectedDatabase);
    if (!database) return;

    try {
      const jsonData = JSON.stringify(database, null, 2);
      downloadFile(jsonData, `${database.name}.json`, 'application/json');
      toast({
        title: "Database Exported",
        description: `Successfully exported ${database.name} as JSON`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export database.",
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
