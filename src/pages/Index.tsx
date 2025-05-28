
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { DatabaseSidebar } from '@/components/DatabaseSidebar';
import { TableView } from '@/components/TableView';
import { SchemaEditor } from '@/components/SchemaEditor';
import { CreateDatabaseDialog } from '@/components/CreateDatabaseDialog';
import { CreateTableDialog } from '@/components/CreateTableDialog';
import { EditDatabaseDialog } from '@/components/EditDatabaseDialog';
import { AddRowDialog } from '@/components/AddRowDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useDatabaseOperations } from '@/hooks/useDatabaseOperations';
import { useTableOperations } from '@/hooks/useTableOperations';
import { useDialogState } from '@/hooks/useDialogState';

const Index = () => {
  const {
    databases,
    setDatabases,
    selectedDatabase,
    setSelectedDatabase,
    selectedTable,
    setSelectedTable,
    handleCreateDatabase,
    handleImportDatabase,
    handleExportDatabase,
    handleEditDatabase,
    handleDeleteDatabase,
  } = useDatabaseOperations();

  const {
    handleCreateTable,
    handleImportTable,
    handleUpdateTable,
    handleAddRow,
    handleDeleteTable,
    handleEditRow,
    handleDeleteRow,
    handleSaveSchema,
  } = useTableOperations({ 
    databases, 
    setDatabases, 
    selectedDatabase, 
    selectedTable,
    setSelectedTable
  });

  const {
    schemaEditorOpen,
    createDatabaseOpen,
    createTableOpen,
    editDatabaseOpen,
    addRowOpen,
    editingDatabase,
    openCreateDatabase,
    closeCreateDatabase,
    openCreateTable,
    closeCreateTable,
    openEditDatabase,
    closeEditDatabase,
    openAddRow,
    closeAddRow,
    openSchemaEditor,
    closeSchemaEditor,
  } = useDialogState();

  const handleEditDatabaseClick = (id: string) => {
    const database = databases.find(db => db.id === id);
    if (database) {
      openEditDatabase(database);
    }
  };

  const handleEditDatabaseSubmit = (name: string) => {
    handleEditDatabase(name, editingDatabase);
  };

  // Get the currently selected table data
  const currentTable = selectedTable ? 
    databases.find(db => db.id === selectedDatabase)?.tables.find(t => t.id === selectedTable) || null 
    : null;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="dbms-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <DatabaseSidebar
              databases={databases}
              selectedDatabase={selectedDatabase}
              selectedTable={selectedTable}
              onSelectDatabase={setSelectedDatabase}
              onSelectTable={setSelectedTable}
              onCreateDatabase={openCreateDatabase}
              onCreateTable={openCreateTable}
              onEditDatabase={handleEditDatabaseClick}
              onDeleteDatabase={handleDeleteDatabase}
              onDeleteTable={handleDeleteTable}
              onImportDatabase={handleImportDatabase}
              onExportDatabase={handleExportDatabase}
            />
            <main className="flex-1 flex flex-col">
              <div className="border-b border-border p-4 bg-card flex items-center justify-between">
                <SidebarTrigger />
                <ThemeToggle />
              </div>
              <TableView
                table={currentTable}
                onEditSchema={openSchemaEditor}
                onAddRow={openAddRow}
                onEditRow={handleEditRow}
                onDeleteRow={handleDeleteRow}
                onImportTable={handleImportTable}
                onUpdateTable={handleUpdateTable}
              />
            </main>

            <SchemaEditor
              isOpen={schemaEditorOpen}
              onClose={closeSchemaEditor}
              tableName={currentTable?.name || ""}
              columns={[]}
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

            <AddRowDialog
              isOpen={addRowOpen}
              onClose={closeAddRow}
              onAddRow={handleAddRow}
              columns={currentTable?.columns || []}
              tableName={currentTable?.name || ""}
            />
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
};

export default Index;
