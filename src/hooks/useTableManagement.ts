
import { useToast } from '@/hooks/use-toast';
import { Table, Database } from '@/types/database';

interface UseTableManagementProps {
  databases: Database[];
  setDatabases: React.Dispatch<React.SetStateAction<Database[]>>;
  selectedDatabase: string | null;
  selectedTable: string | null;
  setSelectedTable: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useTableManagement({ 
  databases, 
  setDatabases, 
  selectedDatabase, 
  selectedTable,
  setSelectedTable
}: UseTableManagementProps) {
  const { toast } = useToast();

  const handleCreateTable = (name: string) => {
    if (!selectedDatabase) {
      toast({
        title: "No Database Selected",
        description: "Please select a database first.",
        variant: "destructive",
      });
      return;
    }

    const newTable: Table = {
      id: Date.now().toString(),
      name,
      columns: [
        {
          id: 'id',
          name: 'id',
          type: 'number',
          nullable: false,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
          defaultValue: null,
        }
      ],
      rows: [],
    };

    setDatabases(prev => prev.map(db => 
      db.id === selectedDatabase 
        ? { ...db, tables: [...db.tables, newTable] }
        : db
    ));

    toast({
      title: "Table Created",
      description: `Table "${name}" has been created successfully.`,
    });
  };

  const handleImportTable = (tableData: Table) => {
    if (!selectedDatabase) {
      toast({
        title: "No Database Selected",
        description: "Please select a database first.",
        variant: "destructive",
      });
      return;
    }

    setDatabases(prev => prev.map(db => 
      db.id === selectedDatabase 
        ? { ...db, tables: [...db.tables, tableData] }
        : db
    ));
  };

  const handleUpdateTable = (updatedTable: Table) => {
    if (!selectedDatabase) return;

    setDatabases(prev => prev.map(db => 
      db.id === selectedDatabase 
        ? { 
            ...db, 
            tables: db.tables.map(table => 
              table.id === updatedTable.id ? updatedTable : table
            )
          }
        : db
    ));
  };

  const handleEditTable = (name: string, editingTable: Table | null) => {
    if (!selectedDatabase || !editingTable) {
      toast({
        title: "Error",
        description: "Unable to edit table. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setDatabases(prev => prev.map(db => 
      db.id === selectedDatabase 
        ? {
            ...db,
            tables: db.tables.map(table => 
              table.id === editingTable.id 
                ? { ...table, name }
                : table
            )
          }
        : db
    ));

    toast({
      title: "Table Updated",
      description: `Table renamed to "${name}" successfully.`,
    });
  };

  const handleDeleteTable = (tableId: string) => {
    if (!selectedDatabase) return;

    const database = databases.find(db => db.id === selectedDatabase);
    const table = database?.tables.find(t => t.id === tableId);
    
    if (!table) return;

    setDatabases(prev => prev.map(db => 
      db.id === selectedDatabase 
        ? { ...db, tables: db.tables.filter(t => t.id !== tableId) }
        : db
    ));

    // Clear selected table if it was the one being deleted
    if (selectedTable === tableId) {
      setSelectedTable(null);
    }

    toast({
      title: "Table Deleted",
      description: `Table "${table.name}" has been deleted successfully.`,
      variant: "destructive",
    });
  };

  return {
    handleCreateTable,
    handleImportTable,
    handleUpdateTable,
    handleEditTable,
    handleDeleteTable,
  };
}
