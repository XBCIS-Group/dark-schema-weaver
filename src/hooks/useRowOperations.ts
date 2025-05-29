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
    console.log('=== HANDLE ADD ROW CALLED ===');
    console.log('Received rowData:', rowData);
    console.log('Selected database:', selectedDatabase);
    console.log('Selected table:', selectedTable);
    console.log('Current databases state:', databases);
    
    if (!selectedDatabase || !selectedTable) {
      console.error('Missing selection - database:', selectedDatabase, 'table:', selectedTable);
      toast({
        title: "Error",
        description: "No database or table selected.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('=== UPDATING DATABASES STATE ===');
      
      setDatabases(prev => {
        console.log('Previous databases state:', prev);
        
        const targetDatabase = prev.find(db => db.id === selectedDatabase);
        console.log('Target database found:', targetDatabase);
        
        if (!targetDatabase) {
          console.error('Database not found with ID:', selectedDatabase);
          throw new Error(`Database not found: ${selectedDatabase}`);
        }
        
        const targetTable = targetDatabase.tables.find(table => table.id === selectedTable);
        console.log('Target table found:', targetTable);
        
        if (!targetTable) {
          console.error('Table not found with ID:', selectedTable);
          throw new Error(`Table not found: ${selectedTable}`);
        }
        
        console.log('Current table rows:', targetTable.rows);
        console.log('Adding new row:', rowData);
        
        const updated = prev.map(db => {
          if (db.id === selectedDatabase) {
            return {
              ...db,
              tables: db.tables.map(table => {
                if (table.id === selectedTable) {
                  const newRows = [...table.rows, rowData];
                  console.log('New rows array:', newRows);
                  return { ...table, rows: newRows };
                }
                return table;
              })
            };
          }
          return db;
        });
        
        console.log('Updated databases state:', updated);
        return updated;
      });

      console.log('=== ROW ADDED SUCCESSFULLY ===');
      toast({
        title: "Row Added",
        description: "New row has been added successfully.",
      });
    } catch (error) {
      console.error('=== ERROR ADDING ROW ===');
      console.error('Error details:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      toast({
        title: "Error",
        description: `Failed to add row: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
