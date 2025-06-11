import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MainLayout } from '@/components/layout/MainLayout';
import { SidebarPanel } from '@/components/layout/SidebarPanel';
import { MainContentPanel } from '@/components/layout/MainContentPanel';
import { ResizableHandle } from '@/components/ui/resizable';
import { DialogsContainer } from '@/components/layout/DialogsContainer';
import { Database, Table } from '@/types/database';

export default function Index() {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedRowData, setSelectedRowData] = useState<Record<string, any> | null>(null);
  const [dialogState, setDialogState] = useState({
    createDatabase: false,
    editDatabase: false,
    createTable: false,
    editTable: false,
    schemaEditor: false,
    addRow: false,
    editRow: false,
  });

  useEffect(() => {
    const storedDatabases = localStorage.getItem('databases');
    if (storedDatabases) {
      setDatabases(JSON.parse(storedDatabases));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('databases', JSON.stringify(databases));
  }, [databases]);

  const currentDatabase = databases.find(db => db.id === selectedDatabase) || null;
  const currentTable = currentDatabase?.tables.find(table => table.id === selectedTable) || null;

  const onSelectDatabase = useCallback((id: string | null) => {
    setSelectedDatabase(id);
    setSelectedTable(null);
  }, []);

  const onSelectTable = useCallback((id: string | null) => {
    setSelectedTable(id);
  }, []);

  const handleCreateDatabase = (name: string) => {
    const newDatabase: Database = { id: uuidv4(), name: name, tables: [] };
    setDatabases([...databases, newDatabase]);
    setSelectedDatabase(newDatabase.id);
  };

  const handleUpdateDatabase = (id: string, name: string) => {
    const updatedDatabases = databases.map(db =>
      db.id === id ? { ...db, name: name } : db
    );
    setDatabases(updatedDatabases);
  };

  const handleDeleteDatabase = (id: string) => {
    const updatedDatabases = databases.filter(db => db.id !== id);
    setDatabases(updatedDatabases);
    setSelectedDatabase(null);
    setSelectedTable(null);
  };

  const handleCreateTable = (name: string) => {
    if (selectedDatabase) {
      const newTable: Table = { id: uuidv4(), name: name, columns: [], rows: [] };
      const updatedDatabases = databases.map(db =>
        db.id === selectedDatabase
          ? { ...db, tables: [...db.tables, newTable] }
          : db
      );
      setDatabases(updatedDatabases);
      setSelectedTable(newTable.id);
    }
  };

  const handleUpdateTable = (databaseId: string, tableId: string, name: string) => {
    const updatedDatabases = databases.map(db => {
      if (db.id === databaseId) {
        const updatedTables = db.tables.map(table =>
          table.id === tableId ? { ...table, name: name } : table
        );
        return { ...db, tables: updatedTables };
      }
      return db;
    });
    setDatabases(updatedDatabases);
  };

  const updateTable = (databaseId: string, tableData: Table) => {
    const updatedDatabases = databases.map(db => {
      if (db.id === databaseId) {
        const updatedTables = db.tables.map(table =>
          table.id === tableData.id ? tableData : table
        );
        return { ...db, tables: updatedTables };
      }
      return db;
    });
    setDatabases(updatedDatabases);
  };

  const handleDeleteTable = (tableId: string) => {
    if (selectedDatabase) {
      const updatedDatabases = databases.map(db => {
        if (db.id === selectedDatabase) {
          const updatedTables = db.tables.filter(table => table.id !== tableId);
          return { ...db, tables: updatedTables };
        }
        return db;
      });
      setDatabases(updatedDatabases);
      setSelectedTable(null);
    }
  };

  const handleAddRow = (rowData: Record<string, any>) => {
    if (selectedDatabase && selectedTable) {
      const updatedDatabases = databases.map(db => {
        if (db.id === selectedDatabase) {
          const updatedTables = db.tables.map(table => {
            if (table.id === selectedTable) {
              return { ...table, rows: [...table.rows, rowData] };
            }
            return table;
          });
          return { ...db, tables: updatedTables };
        }
        return db;
      });
      setDatabases(updatedDatabases);
    }
  };

  const handleUpdateRow = (rowData: Record<string, any>) => {
    if (selectedDatabase && selectedTable) {
      const updatedDatabases = databases.map(db => {
        if (db.id === selectedDatabase) {
          const updatedTables = db.tables.map(table => {
            if (table.id === selectedTable) {
              const updatedRows = table.rows.map(row =>
                Object.keys(rowData).every(key => row[key] === rowData[key]) ? rowData : row
              );
              return { ...table, rows: updatedRows };
            }
            return table;
          });
          return { ...db, tables: updatedTables };
        }
        return db;
      });
      setDatabases(updatedDatabases);
    }
  };

  const handleDeleteRow = (rowData: any) => {
    if (selectedDatabase && selectedTable) {
      const updatedDatabases = databases.map(db => {
        if (db.id === selectedDatabase) {
          const updatedTables = db.tables.map(table => {
            if (table.id === selectedTable) {
              const updatedRows = table.rows.filter(row => !Object.keys(rowData).every(key => row[key] === rowData[key]));
              return { ...table, rows: updatedRows };
            }
            return table;
          });
          return { ...db, tables: updatedTables };
        }
        return db;
      });
      setDatabases(updatedDatabases);
    }
  };

  return (
    <MainLayout>
      <SidebarPanel
        databases={databases}
        selectedDatabase={selectedDatabase}
        selectedTable={selectedTable}
        onSelectDatabase={onSelectDatabase}
        onSelectTable={onSelectTable}
        onCreateDatabase={() => setDialogState({ ...dialogState, createDatabase: true })}
        onCreateTable={() => setDialogState({ ...dialogState, createTable: true })}
        onEditDatabase={(id) => {
          setSelectedDatabase(id);
          setDialogState({ ...dialogState, editDatabase: true });
        }}
        onEditTable={(id) => {
          setSelectedTable(id);
          setDialogState({ ...dialogState, editTable: true });
        }}
        onDeleteDatabase={handleDeleteDatabase}
        onDeleteTable={handleDeleteTable}
        onImportDatabase={() => {
          // Handle import database logic
        }}
        onExportDatabase={() => {
          // Handle export database logic
        }}
      />
      <ResizableHandle withHandle />
      <MainContentPanel
        currentTable={currentTable}
        onEditSchema={() => setDialogState({ ...dialogState, schemaEditor: true })}
        onAddRow={() => setDialogState({ ...dialogState, addRow: true })}
        onEditRow={(rowData) => {
          setSelectedRowData(rowData);
          setDialogState({ ...dialogState, editRow: true });
        }}
        onDeleteRow={handleDeleteRow}
        onImportTable={(tableData) => {
          const targetDatabase = databases.find(db => db.id === selectedDatabase);
          if (targetDatabase) {
            updateTable(targetDatabase.id, tableData);
          }
        }}
        onUpdateTable={(tableData) => {
          const targetDatabase = databases.find(db => db.id === selectedDatabase);
          if (targetDatabase) {
            updateTable(targetDatabase.id, tableData);
          }
        }}
        onDeleteTable={() => {
          if (selectedTable) {
            handleDeleteTable(selectedTable);
          }
        }}
      />
      
      <DialogsContainer
        dialogState={dialogState}
        setDialogState={setDialogState}
        databases={databases}
        selectedDatabase={selectedDatabase}
        selectedTable={selectedTable}
        currentTable={currentTable}
        selectedRowData={selectedRowData}
        onCreateDatabase={handleCreateDatabase}
        onUpdateDatabase={handleUpdateDatabase}
        onCreateTable={handleCreateTable}
        onUpdateTable={(databaseId: string, tableId: string, name: string) => handleUpdateTable(databaseId, tableId, name)}
        onAddRow={handleAddRow}
        onUpdateRow={handleUpdateRow}
      />
    </MainLayout>
  );
}
