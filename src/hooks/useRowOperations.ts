
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/types/database';

interface UseRowOperationsProps {
  databases: Database[];
  setDatabases: React.Dispatch<React.SetStateAction<Database[]>>;
  selectedDatabase: string | null;
  selectedTable: string | null;
}

export function useRowOperations({ 
  databases, 
  setDatabases, 
  selectedDatabase, 
  selectedTable
}: UseRowOperationsProps) {
  const { toast } = useToast();

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

  const handleEditRow = (updatedRowData: Record<string, any>) => {
    if (!selectedDatabase || !selectedTable) return;

    setDatabases(prev => prev.map(db => 
      db.id === selectedDatabase 
        ? {
            ...db,
            tables: db.tables.map(table => 
              table.id === selectedTable
                ? { 
                    ...table, 
                    rows: table.rows.map(row => 
                      row.id === updatedRowData.id ? updatedRowData : row
                    )
                  }
                : table
            )
          }
        : db
    ));

    toast({
      title: "Row Updated",
      description: "Row has been updated successfully.",
    });
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

  return {
    handleAddRow,
    handleEditRow,
    handleDeleteRow,
  };
}
