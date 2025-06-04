import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DatabaseSidebar } from '@/components/DatabaseSidebar';
import { TableView } from '@/components/TableView';
import { SchemaEditor } from '@/components/SchemaEditor';
import { CreateDatabaseDialog } from '@/components/CreateDatabaseDialog';
import { CreateTableDialog } from '@/components/CreateTableDialog';
import { EditDatabaseDialog } from '@/components/EditDatabaseDialog';
import { EditTableDialog } from '@/components/EditTableDialog';
import { AddRowDialog } from '@/components/AddRowDialog';
import { EditRowDialog } from '@/components/EditRowDialog';
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
    handleEditTable,
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

  const handleEditTableClick = (id: string) => {
    const database = databases.find(db => db.id === selectedDatabase);
    const table = database?.tables.find(t => t.id === id);
    if (table) {
      openEditTable(table);
    }
  };

  const handleEditTableSubmit = (name: string) => {
    handleEditTable(name, editingTable);
  };

  const handleEditRowClick = (rowData: Record<string, any>) => {
    openEditRow(rowData);
  };

  // Get the currently selected table data
  const currentTable = selectedTable ? 
    databases.find(db => db.id === selectedDatabase)?.tables.find(t => t.id === selectedTable) || null 
    : null;

  const handleDeleteTableFromView = () => {
    if (selectedTable) {
      handleDeleteTable(selectedTable);
    }
  };

  // Add validation for opening AddRow dialog
  const handleOpenAddRow = () => {
    if (!selectedDatabase || !selectedTable || !currentTable) {
      console.error('Cannot open add row dialog: missing selection');
      return;
    }
    
    if (!currentTable.columns || currentTable.columns.length === 0) {
      console.error('Cannot open add row dialog: no columns in table');
      return;
    }
    
    openAddRow();
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="dbms-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <ErrorBoundary>
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
                onEditTable={handleEditTableClick}
                onDeleteDatabase={handleDeleteDatabase}
                onDeleteTable={handleDeleteTable}
                onImportDatabase={handleImportDatabase}
                onExportDatabase={handleExportDatabase}
              />
              <main className="flex-1 flex flex-col h-full">
                <div className="border-b border-border p-4 bg-card flex items-center justify-between">
                  <SidebarTrigger />
                  <ThemeToggle />
                </div>
                <ErrorBoundary>
                  <TableView
                    table={currentTable}
                    onEditSchema={openSchemaEditor}
                    onAddRow={handleOpenAddRow}
                    onEditRow={handleEditRowClick}
                    onDeleteRow={handleDeleteRow}
                    onImportTable={handleImportTable}
                    onUpdateTable={handleUpdateTable}
                    onDeleteTable={handleDeleteTableFromView}
                  />
                </ErrorBoundary>
              </main>

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
            </div>
          </SidebarProvider>
        </ErrorBoundary>
      </div>
    </ThemeProvider>
  );
};

export default Index;
