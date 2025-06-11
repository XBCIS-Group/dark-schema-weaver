
import { useState } from 'react';

export function useDatabaseSelection() {
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const selectDatabase = (databaseId: string | null) => {
    setSelectedDatabase(databaseId);
    if (databaseId !== selectedDatabase) {
      setSelectedTable(null); // Clear table selection when database changes
    }
  };

  const selectTable = (tableId: string | null) => {
    setSelectedTable(tableId);
  };

  const clearSelection = () => {
    setSelectedDatabase(null);
    setSelectedTable(null);
  };

  return {
    selectedDatabase,
    selectedTable,
    selectDatabase,
    selectTable,
    clearSelection,
  };
}
