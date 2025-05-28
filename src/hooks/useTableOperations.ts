
import { Database } from '@/types/database';
import { useTableManagement } from '@/hooks/useTableManagement';
import { useRowOperations } from '@/hooks/useRowOperations';
import { useSchemaOperations } from '@/hooks/useSchemaOperations';

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
  const {
    handleCreateTable,
    handleImportTable,
    handleUpdateTable,
    handleDeleteTable,
  } = useTableManagement({ 
    databases, 
    setDatabases, 
    selectedDatabase, 
    selectedTable,
    setSelectedTable
  });

  const {
    handleAddRow,
    handleEditRow,
    handleDeleteRow,
  } = useRowOperations({ 
    databases, 
    setDatabases, 
    selectedDatabase, 
    selectedTable
  });

  const {
    handleSaveSchema,
  } = useSchemaOperations({ 
    databases, 
    setDatabases, 
    selectedDatabase, 
    selectedTable
  });

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
