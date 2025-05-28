
import { useState } from 'react';
import { Database, Table } from '@/types/database';

export function useDialogState() {
  const [schemaEditorOpen, setSchemaEditorOpen] = useState(false);
  const [createDatabaseOpen, setCreateDatabaseOpen] = useState(false);
  const [createTableOpen, setCreateTableOpen] = useState(false);
  const [editDatabaseOpen, setEditDatabaseOpen] = useState(false);
  const [editTableOpen, setEditTableOpen] = useState(false);
  const [addRowOpen, setAddRowOpen] = useState(false);
  const [editRowOpen, setEditRowOpen] = useState(false);
  const [editingDatabase, setEditingDatabase] = useState<Database | null>(null);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [editingRowData, setEditingRowData] = useState<Record<string, any> | null>(null);

  const openCreateDatabase = () => setCreateDatabaseOpen(true);
  const closeCreateDatabase = () => setCreateDatabaseOpen(false);

  const openCreateTable = () => setCreateTableOpen(true);
  const closeCreateTable = () => setCreateTableOpen(false);

  const openEditDatabase = (database: Database) => {
    setEditingDatabase(database);
    setEditDatabaseOpen(true);
  };
  const closeEditDatabase = () => {
    setEditDatabaseOpen(false);
    setEditingDatabase(null);
  };

  const openEditTable = (table: Table) => {
    setEditingTable(table);
    setEditTableOpen(true);
  };
  const closeEditTable = () => {
    setEditTableOpen(false);
    setEditingTable(null);
  };

  const openAddRow = () => setAddRowOpen(true);
  const closeAddRow = () => setAddRowOpen(false);

  const openEditRow = (rowData: Record<string, any>) => {
    setEditingRowData(rowData);
    setEditRowOpen(true);
  };
  const closeEditRow = () => {
    setEditRowOpen(false);
    setEditingRowData(null);
  };

  const openSchemaEditor = () => setSchemaEditorOpen(true);
  const closeSchemaEditor = () => setSchemaEditorOpen(false);

  return {
    schemaEditorOpen,
    createDatabaseOpen,
    createTableOpen,
    editDatabaseOpen,
    editTableOpen,
    addRowOpen,
    editRowOpen,
    editingDatabase,
    editingTable,
    editingRowData,
    openCreateDatabase,
    closeCreateDatabase,
    openCreateTable,
    closeCreateTable,
    openEditDatabase,
    closeEditDatabase,
    openEditTable,
    closeEditTable,
    openAddRow,
    closeAddRow,
    openEditRow,
    closeEditRow,
    openSchemaEditor,
    closeSchemaEditor,
  };
}
