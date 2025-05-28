import { useToast } from '@/hooks/use-toast';

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

interface UseTableOperationsProps {
  databases: Database[];
  setDatabases: React.Dispatch<React.SetStateAction<Database[]>>;
  selectedDatabase: string | null;
  selectedTable: string | null;
  setSelectedTable: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useTableOperations({ 
  databases, 
  setDatabases, 
  selectedDatabase, 
  selectedTable,
  setSelectedTable
}: UseTableOperationsProps) {
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
          type: 'INTEGER',
          nullable: false,
          primaryKey: true,
          unique: true,
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

  const handleAddRow = (rowData: Record<string, any>) => {
    if (!selectedDatabase || !selectedTable) return;

    setDatabases(prev => prev.map(db => 
      db.id === selectedDatabase 
        ? {
            ...db,
            tables: db.tables.map(table => 
              table.id === selectedTable
                ? { ...table, rows: [...table.rows, rowData] }
                : table
            )
          }
        : db
    ));

    toast({
      title: "Row Added",
      description: "New row has been added successfully.",
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

  const handleEditRow = (rowData: any) => {
    toast({
      title: "Edit Row",
      description: `Edit row with ID: ${rowData.id || 'unknown'}`,
    });
    console.log('Edit row data:', rowData);
  };

  const handleDeleteRow = (rowData: any) => {
    if (!selectedDatabase || !selectedTable) return;

    setDatabases(prev => prev.map(db => 
      db.id === selectedDatabase 
        ? {
            ...db,
            tables: db.tables.map(table => 
              table.id === selectedTable
                ? { 
                    ...table, 
                    rows: table.rows.filter(row => row.id !== rowData.id) 
                  }
                : table
            )
          }
        : db
    ));

    toast({
      title: "Row Deleted",
      description: `Row has been deleted successfully.`,
      variant: "destructive",
    });
  };

  const handleSaveSchema = (tableName: string, columns: Column[]) => {
    if (!selectedDatabase || !selectedTable) return;

    setDatabases(prev => prev.map(db => 
      db.id === selectedDatabase 
        ? {
            ...db,
            tables: db.tables.map(table => 
              table.id === selectedTable
                ? { ...table, columns: columns, name: tableName }
                : table
            )
          }
        : db
    ));

    toast({
      title: "Schema Updated",
      description: `Schema for table "${tableName}" has been updated successfully.`,
    });
  };

  return {
    handleCreateTable,
    handleImportTable,
    handleUpdateTable,
    handleAddRow,
    handleDeleteTable,
    handleEditRow,
    handleDeleteRow,
    handleSaveSchema,
  };
}
