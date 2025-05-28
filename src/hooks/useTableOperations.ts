
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
}

export function useTableOperations({ 
  databases, 
  setDatabases, 
  selectedDatabase, 
  selectedTable 
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
      columns: [],
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

  const handleDeleteTable = (id: string) => {
    toast({
      title: "Delete Table",
      description: "Table deletion functionality would be implemented here.",
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
    toast({
      title: "Delete Row",
      description: `Row with ID ${rowData.id || 'unknown'} would be deleted.`,
      variant: "destructive",
    });
    console.log('Delete row data:', rowData);
  };

  const handleSaveSchema = (tableName: string, columns: any[]) => {
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
