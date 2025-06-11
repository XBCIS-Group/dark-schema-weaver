
import React from 'react';
import { SchemaEditor } from '@/components/SchemaEditor';
import { CreateDatabaseDialog } from '@/components/CreateDatabaseDialog';
import { CreateTableDialog } from '@/components/CreateTableDialog';
import { EditDatabaseDialog } from '@/components/EditDatabaseDialog';
import { EditTableDialog } from '@/components/EditTableDialog';
import { AddRowDialog } from '@/components/AddRowDialog';
import { EditRowDialog } from '@/components/EditRowDialog';
import { Database, Table } from '@/types/database';

interface DialogsContainerProps {
  dialogState: {
    createDatabase: boolean;
    editDatabase: boolean;
    createTable: boolean;
    editTable: boolean;
    schemaEditor: boolean;
    addRow: boolean;
    editRow: boolean;
  };
  setDialogState: React.Dispatch<React.SetStateAction<{
    createDatabase: boolean;
    editDatabase: boolean;
    createTable: boolean;
    editTable: boolean;
    schemaEditor: boolean;
    addRow: boolean;
    editRow: boolean;
  }>>;
  databases: Database[];
  selectedDatabase: string | null;
  selectedTable: string | null;
  currentTable: Table | null;
  selectedRowData: Record<string, any> | null;
  onCreateDatabase: (name: string) => void;
  onUpdateDatabase: (id: string, name: string) => void;
  onCreateTable: (name: string) => void;
  onUpdateTable: (databaseId: string, tableId: string, name: string) => void;
  onAddRow: (rowData: Record<string, any>) => void;
  onUpdateRow: (rowData: Record<string, any>) => void;
}

export function DialogsContainer({
  dialogState,
  setDialogState,
  databases,
  selectedDatabase,
  selectedTable,
  currentTable,
  selectedRowData,
  onCreateDatabase,
  onUpdateDatabase,
  onCreateTable,
  onUpdateTable,
  onAddRow,
  onUpdateRow,
}: DialogsContainerProps) {
  const selectedDb = databases.find(db => db.id === selectedDatabase);
  const selectedTbl = selectedDb?.tables.find(table => table.id === selectedTable);

  const handleSaveSchema = (columns: any[]) => {
    // Handle schema save logic here
    setDialogState({ ...dialogState, schemaEditor: false });
  };

  return (
    <>
      <SchemaEditor
        isOpen={dialogState.schemaEditor}
        onClose={() => setDialogState({ ...dialogState, schemaEditor: false })}
        tableName={currentTable?.name || ""}
        columns={currentTable?.columns || []}
        onSave={handleSaveSchema}
      />

      <CreateDatabaseDialog
        isOpen={dialogState.createDatabase}
        onClose={() => setDialogState({ ...dialogState, createDatabase: false })}
        onCreateDatabase={(name) => {
          onCreateDatabase(name);
          setDialogState({ ...dialogState, createDatabase: false });
        }}
      />

      <CreateTableDialog
        isOpen={dialogState.createTable}
        onClose={() => setDialogState({ ...dialogState, createTable: false })}
        onCreateTable={(name) => {
          onCreateTable(name);
          setDialogState({ ...dialogState, createTable: false });
        }}
      />

      <EditDatabaseDialog
        isOpen={dialogState.editDatabase}
        onClose={() => setDialogState({ ...dialogState, editDatabase: false })}
        onEditDatabase={(name) => {
          if (selectedDatabase) {
            onUpdateDatabase(selectedDatabase, name);
            setDialogState({ ...dialogState, editDatabase: false });
          }
        }}
        currentName={selectedDb?.name || ''}
      />

      <EditTableDialog
        isOpen={dialogState.editTable}
        onClose={() => setDialogState({ ...dialogState, editTable: false })}
        onEditTable={(name) => {
          if (selectedDatabase && selectedTable) {
            onUpdateTable(selectedDatabase, selectedTable, name);
            setDialogState({ ...dialogState, editTable: false });
          }
        }}
        currentName={selectedTbl?.name || ''}
      />

      {/* Only render AddRowDialog if we have valid table data */}
      {currentTable && currentTable.columns && currentTable.columns.length > 0 && (
        <AddRowDialog
          isOpen={dialogState.addRow}
          onClose={() => setDialogState({ ...dialogState, addRow: false })}
          onAddRow={(rowData) => {
            onAddRow(rowData);
            setDialogState({ ...dialogState, addRow: false });
          }}
          columns={currentTable.columns}
          tableName={currentTable.name}
        />
      )}

      <EditRowDialog
        isOpen={dialogState.editRow}
        onClose={() => setDialogState({ ...dialogState, editRow: false })}
        onEditRow={(rowData) => {
          onUpdateRow(rowData);
          setDialogState({ ...dialogState, editRow: false });
        }}
        columns={currentTable?.columns || []}
        rowData={selectedRowData}
        tableName={currentTable?.name || ""}
      />
    </>
  );
}
