
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
    console.log('handleAddRow called with:', rowData);
    console.log('Selected database:', selectedDatabase);
    console.log('Selected table:', selectedTable);
    
    if (!selectedDatabase || !selectedTable) {
      console.error('No database or table selected');
      toast({
        title: "Error",
        description: "No database or table selected.",
        variant: "destructive",
      });
      return;
    }

    try {
      setDatabases(prev => {
        const updated = prev.map(db => 
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
        );
        console.log('Updated databases:', updated);
        return updated;
      });

      toast({
        title: "Row Added",
        description: "New row has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding row:', error);
      toast({
        title: "Error",
        description: "Failed to add row. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditRow = (updatedRowData: Record<string, any>) => {
    console.log('handleEditRow called with:', updatedRowData);
    
    if (!selectedDatabase || !selectedTable) {
      console.error('No database or table selected');
      return;
    }

    try {
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
    } catch (error) {
      console.error('Error editing row:', error);
      toast({
        title: "Error",
        description: "Failed to update row. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRow = (rowData: any) => {
    console.log('handleDeleteRow called with:', rowData);
    
    if (!selectedDatabase || !selectedTable) {
      console.error('No database or table selected');
      return;
    }

    try {
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
    } catch (error) {
      console.error('Error deleting row:', error);
      toast({
        title: "Error",
        description: "Failed to delete row. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleAddRow,
    handleEditRow,
    handleDeleteRow,
  };
}
