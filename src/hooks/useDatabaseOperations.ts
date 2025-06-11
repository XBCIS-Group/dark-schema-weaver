
import { useDatabaseCRUD } from '@/hooks/useDatabaseCRUD';
import { useDatabaseImportExport } from '@/hooks/useDatabaseImportExport';
import { useDatabaseSelection } from '@/hooks/useDatabaseSelection';

export function useDatabaseOperations() {
  const { 
    databases, 
    setDatabases, 
    createDatabase, 
    editDatabase, 
    deleteDatabase 
  } = useDatabaseCRUD();

  const { importDatabase, exportDatabase } = useDatabaseImportExport();
  const { 
    selectedDatabase, 
    selectedTable, 
    selectDatabase, 
    selectTable, 
    clearSelection 
  } = useDatabaseSelection();

  const handleCreateDatabase = (name: string) => {
    createDatabase(name);
  };

  const handleImportDatabase = async () => {
    const importedDatabase = await importDatabase();
    if (importedDatabase) {
      setDatabases(prev => [...prev, importedDatabase]);
    }
  };

  const handleExportDatabase = async () => {
    if (!selectedDatabase) return;
    
    const database = databases.find(db => db.id === selectedDatabase);
    if (database) {
      await exportDatabase(database);
    }
  };

  const handleEditDatabase = (name: string, editingDatabase: any) => {
    editDatabase(name, editingDatabase);
  };

  const handleDeleteDatabase = (id: string) => {
    deleteDatabase(id);
    if (selectedDatabase === id) {
      clearSelection();
    }
  };

  return {
    databases,
    setDatabases,
    selectedDatabase,
    setSelectedDatabase: selectDatabase,
    selectedTable,
    setSelectedTable: selectTable,
    handleCreateDatabase,
    handleImportDatabase,
    handleExportDatabase,
    handleEditDatabase,
    handleDeleteDatabase,
  };
}
