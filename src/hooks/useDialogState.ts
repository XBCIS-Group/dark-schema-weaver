import { useState } from 'react';
import { Table } from '@/types/database';

interface Database {
  id: string;
  name: string;
  tables: any[];
}

export function useDialogState() {
  const [schemaEditorOpen, setSchemaEditorOpen] = useState(false);
  const [createDatabaseOpen, setCreateDatabaseOpen] = useState(false);
  const [createTableOpen, setCreateTableOpen] = useState(false);
  const [editDatabaseOpen, setEditDatabaseOpen] = useState(false);
  const [editTableOpen, setEditTableOpen] = useState(false);
  const [addRowOpen, setAddRowOpen] = useState(false);
  const [editingDatabase, setEditingDatabase] = useState<Database | null>(null);
  const [editingTable, setEditingTable] = useState<Table | null>(null);

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

  const openSchemaEditor = () => setSchemaEditorOpen(true);
  const closeSchemaEditor = () => setSchemaEditorOpen(false);

  return {
    schemaEditorOpen,
    createDatabaseOpen,
    createTableOpen,
    editDatabaseOpen,
    editTableOpen,
    addRowOpen,
    editingDatabase,
    editingTable,
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
    openSchemaEditor,
    closeSchemaEditor,
  };
}
