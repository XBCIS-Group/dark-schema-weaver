
import React from 'react';
import { SchemaEditor } from '@/components/SchemaEditor';
import { CreateDatabaseDialog } from '@/components/CreateDatabaseDialog';
import { CreateTableDialog } from '@/components/CreateTableDialog';
import { EditDatabaseDialog } from '@/components/EditDatabaseDialog';
import { EditTableDialog } from '@/components/EditTableDialog';
import { AddRowDialog } from '@/components/AddRowDialog';
import { EditRowDialog } from '@/components/EditRowDialog';
import { Database, Table, Column } from '@/types/database';

interface DialogsContainerProps {
  // Schema Editor
  schemaEditorOpen: boolean;
  closeSchemaEditor: () => void;
  currentTable: Table | null;
  handleSaveSchema: (columns: Column[]) => void;
  
  // Create Database
  createDatabaseOpen: boolean;
  closeCreateDatabase: () => void;
  handleCreateDatabase: (name: string) => void;
  
  // Create Table
  createTableOpen: boolean;
  closeCreateTable: () => void;
  handleCreateTable: (name: string) => void;
  
  // Edit Database
  editDatabaseOpen: boolean;
  closeEditDatabase: () => void;
  handleEditDatabaseSubmit: (name: string) => void;
  editingDatabase: Database | null;
  
  // Edit Table
  editTableOpen: boolean;
  closeEditTable: () => void;
  handleEditTableSubmit: (name: string) => void;
  editingTable: Table | null;
  
  // Add Row
  addRowOpen: boolean;
  closeAddRow: () => void;
  handleAddRow: (rowData: Record<string, any>) => void;
  
  // Edit Row
  editRowOpen: boolean;
  closeEditRow: () => void;
  handleEditRow: (rowData: Record<string, any>) => void;
  editingRowData: Record<string, any> | null;
}

export function DialogsContainer({
  schemaEditorOpen,
  closeSchemaEditor,
  currentTable,
  handleSaveSchema,
  createDatabaseOpen,
  closeCreateDatabase,
  handleCreateDatabase,
  createTableOpen,
  closeCreateTable,
  handleCreateTable,
  editDatabaseOpen,
  closeEditDatabase,
  handleEditDatabaseSubmit,
  editingDatabase,
  editTableOpen,
  closeEditTable,
  handleEditTableSubmit,
  editingTable,
  addRowOpen,
  closeAddRow,
  handleAddRow,
  editRowOpen,
  closeEditRow,
  handleEditRow,
  editingRowData,
}: DialogsContainerProps) {
  return (
    <>
      <SchemaEditor
        isOpen={schemaEditorOpen}
        onClose={closeSchemaEditor}
        tableName={currentTable?.name || ""}
        columns={currentTable?.columns || []}
        onSave={handleSaveSchema}
      />

      <CreateDatabaseDialog
        isOpen={createDatabaseOpen}
        onClose={closeCreateDatabase}
        onCreateDatabase={handleCreateDatabase}
      />

      <CreateTableDialog
        isOpen={createTableOpen}
        onClose={closeCreateTable}
        onCreateTable={handleCreateTable}
      />

      <EditDatabaseDialog
        isOpen={editDatabaseOpen}
        onClose={closeEditDatabase}
        onEditDatabase={handleEditDatabaseSubmit}
        currentName={editingDatabase?.name || ''}
      />

      <EditTableDialog
        isOpen={editTableOpen}
        onClose={closeEditTable}
        onEditTable={handleEditTableSubmit}
        currentName={editingTable?.name || ''}
      />

      {/* Only render AddRowDialog if we have valid table data */}
      {currentTable && currentTable.columns && currentTable.columns.length > 0 && (
        <AddRowDialog
          isOpen={addRowOpen}
          onClose={closeAddRow}
          onAddRow={handleAddRow}
          columns={currentTable.columns}
          tableName={currentTable.name}
        />
      )}

      <EditRowDialog
        isOpen={editRowOpen}
        onClose={closeEditRow}
        onEditRow={handleEditRow}
        columns={currentTable?.columns || []}
        rowData={editingRowData}
        tableName={currentTable?.name || ""}
      />
    </>
  );
}
