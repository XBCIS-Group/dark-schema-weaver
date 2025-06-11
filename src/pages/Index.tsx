
import React from 'react';
import { ResizableHandle } from '@/components/ui/resizable';
import { MainLayout } from '@/components/layout/MainLayout';
import { SidebarPanel } from '@/components/layout/SidebarPanel';
import { MainContentPanel } from '@/components/layout/MainContentPanel';
import { DialogsContainer } from '@/components/layout/DialogsContainer';
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
    <MainLayout>
      <SidebarPanel
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
      
      <ResizableHandle withHandle className="w-2 bg-border hover:bg-border/80 transition-colors" />
      
      <MainContentPanel
        currentTable={currentTable}
        onEditSchema={openSchemaEditor}
        onAddRow={handleOpenAddRow}
        onEditRow={handleEditRowClick}
        onDeleteRow={handleDeleteRow}
        onImportTable={handleImportTable}
        onUpdateTable={handleUpdateTable}
        onDeleteTable={handleDeleteTableFromView}
      />

      <DialogsContainer
        schemaEditorOpen={schemaEditorOpen}
        closeSchemaEditor={closeSchemaEditor}
        currentTable={currentTable}
        handleSaveSchema={handleSaveSchema}
        createDatabaseOpen={createDatabaseOpen}
        closeCreateDatabase={closeCreateDatabase}
        handleCreateDatabase={handleCreateDatabase}
        createTableOpen={createTableOpen}
        closeCreateTable={closeCreateTable}
        handleCreateTable={handleCreateTable}
        editDatabaseOpen={editDatabaseOpen}
        closeEditDatabase={closeEditDatabase}
        handleEditDatabaseSubmit={handleEditDatabaseSubmit}
        editingDatabase={editingDatabase}
        editTableOpen={editTableOpen}
        closeEditTable={closeEditTable}
        handleEditTableSubmit={handleEditTableSubmit}
        editingTable={editingTable}
        addRowOpen={addRowOpen}
        closeAddRow={closeAddRow}
        handleAddRow={handleAddRow}
        editRowOpen={editRowOpen}
        closeEditRow={closeEditRow}
        handleEditRow={handleEditRow}
        editingRowData={editingRowData}
      />
    </MainLayout>
  );
};

export default Index;
