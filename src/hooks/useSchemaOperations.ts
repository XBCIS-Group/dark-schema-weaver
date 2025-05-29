
import { useToast } from '@/hooks/use-toast';
import { Column, Database } from '@/types/database';

interface UseSchemaOperationsProps {
  databases: Database[];
  setDatabases: React.Dispatch<React.SetStateAction<Database[]>>;
  selectedDatabase: string | null;
  selectedTable: string | null;
}

export function useSchemaOperations({ 
  databases, 
  setDatabases, 
  selectedDatabase, 
  selectedTable
}: UseSchemaOperationsProps) {
  const { toast } = useToast();

  const handleSaveSchema = (columns: Column[]) => {
    if (!selectedDatabase || !selectedTable) return;

    const currentTable = databases
      .find(db => db.id === selectedDatabase)
      ?.tables.find(table => table.id === selectedTable);

    if (!currentTable) return;

    setDatabases(prev => prev.map(db => 
      db.id === selectedDatabase 
        ? {
            ...db,
            tables: db.tables.map(table => 
              table.id === selectedTable
                ? { ...table, columns: columns }
                : table
            )
          }
        : db
    ));

    toast({
      title: "Schema Updated",
      description: `Schema for table "${currentTable.name}" has been updated successfully.`,
    });
  };

  return {
    handleSaveSchema,
  };
}
