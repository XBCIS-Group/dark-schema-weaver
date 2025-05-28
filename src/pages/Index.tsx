
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
import { DatabaseSidebar } from '@/components/DatabaseSidebar';
import { TableView } from '@/components/TableView';
import { SchemaEditor } from '@/components/SchemaEditor';
import { CreateDatabaseDialog } from '@/components/CreateDatabaseDialog';
import { CreateTableDialog } from '@/components/CreateTableDialog';
import { EditDatabaseDialog } from '@/components/EditDatabaseDialog';
import { AddRowDialog } from '@/components/AddRowDialog';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { createFileInput, readFile, downloadFile } from '@/utils/fileUtils';

interface Column {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
}

interface Table {
  id: string;
  name: string;
  columns: Column[];
  rows: Record<string, any>[];
}

interface Database {
  id: string;
  name: string;
  tables: Table[];
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="h-8 w-8 p-0"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

const Index = () => {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [schemaEditorOpen, setSchemaEditorOpen] = useState(false);
  const [createDatabaseOpen, setCreateDatabaseOpen] = useState(false);
  const [createTableOpen, setCreateTableOpen] = useState(false);
  const [editDatabaseOpen, setEditDatabaseOpen] = useState(false);
  const [addRowOpen, setAddRowOpen] = useState(false);
  const [editingDatabase, setEditingDatabase] = useState<Database | null>(null);
  const { toast } = useToast();

  const handleCreateDatabase = () => {
    setCreateDatabaseOpen(true);
  };

  const handleCreateDatabaseSubmit = (name: string) => {
    const newDatabase: Database = {
      id: Date.now().toString(),
      name,
      tables: [],
    };
    
    setDatabases(prev => [...prev, newDatabase]);
    toast({
      title: "Database Created",
      description: `Database "${name}" has been created successfully.`,
    });
  };

  const handleImportDatabase = async () => {
    try {
      const file = await createFileInput('.json');
      if (!file) return;

      const jsonText = await readFile(file);
      const importedData = JSON.parse(jsonText);
      
      const newDatabase: Database = {
        id: Date.now().toString(),
        name: importedData.name || file.name.replace('.json', ''),
        tables: importedData.tables || [],
      };

      setDatabases(prev => [...prev, newDatabase]);
      toast({
        title: "Database Imported",
        description: `Successfully imported database from ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import database. Please check the file format.",
        variant: "destructive",
      });
    }
  };

  const handleExportDatabase = () => {
    if (!selectedDatabase) {
      toast({
        title: "No Database Selected",
        description: "Please select a database to export.",
        variant: "destructive",
      });
      return;
    }

    const database = databases.find(db => db.id === selectedDatabase);
    if (!database) return;

    try {
      const jsonData = JSON.stringify(database, null, 2);
      downloadFile(jsonData, `${database.name}.json`, 'application/json');
      toast({
        title: "Database Exported",
        description: `Successfully exported ${database.name} as JSON`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export database.",
        variant: "destructive",
      });
    }
  };

  const handleCreateTable = () => {
    if (!selectedDatabase) {
      toast({
        title: "No Database Selected",
        description: "Please select a database first.",
        variant: "destructive",
      });
      return;
    }
    setCreateTableOpen(true);
  };

  const handleCreateTableSubmit = (name: string) => {
    if (!selectedDatabase) return;

    const newTable: Table = {
      id: Date.now().toString(),
      name,
      columns: [],
      rows: [],
    };

    setDatabases(prev => prev.map(db => 
      db.id === selectedDatabase 
        ? { ...db, tables: [...db.tables, newTable] }
        : db
    ));

    toast({
      title: "Table Created",
      description: `Table "${name}" has been created successfully.`,
    });
  };

  const handleImportTable = (tableData: Table) => {
    if (!selectedDatabase) {
      toast({
        title: "No Database Selected",
        description: "Please select a database first.",
        variant: "destructive",
      });
      return;
    }

    setDatabases(prev => prev.map(db => 
      db.id === selectedDatabase 
        ? { ...db, tables: [...db.tables, tableData] }
        : db
    ));
  };

  const handleUpdateTable = (updatedTable: Table) => {
    if (!selectedDatabase) return;

    setDatabases(prev => prev.map(db => 
      db.id === selectedDatabase 
        ? { 
            ...db, 
            tables: db.tables.map(table => 
              table.id === updatedTable.id ? updatedTable : table
            )
          }
        : db
    ));
  };

  const handleAddRow = () => {
    setAddRowOpen(true);
  };

  const handleAddRowSubmit = (rowData: Record<string, any>) => {
    if (!selectedDatabase || !selectedTable) return;

    setDatabases(prev => prev.map(db => 
      db.id === selectedDatabase 
        ? {
            ...db,
            tables: db.tables.map(table => 
              table.id === selectedTable
                ? { ...table, rows: [...table.rows, rowData] }
                : table
            )
          }
        : db
    ));

    toast({
      title: "Row Added",
      description: "New row has been added successfully.",
    });
  };

  const handleEditDatabase = (id: string) => {
    const database = databases.find(db => db.id === id);
    if (database) {
      setEditingDatabase(database);
      setEditDatabaseOpen(true);
    }
  };

  const handleEditDatabaseSubmit = (name: string) => {
    if (!editingDatabase) return;

    setDatabases(prev => prev.map(db => 
      db.id === editingDatabase.id 
        ? { ...db, name }
        : db
    ));

    toast({
      title: "Database Updated",
      description: `Database has been renamed to "${name}".`,
    });
  };

  const handleDeleteDatabase = (id: string) => {
    const database = databases.find(db => db.id === id);
    if (database) {
      setDatabases(prev => prev.filter(db => db.id !== id));
      if (selectedDatabase === id) {
        setSelectedDatabase(null);
        setSelectedTable(null);
      }
      toast({
        title: "Database Deleted",
        description: `Database "${database.name}" has been deleted.`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteTable = (id: string) => {
    toast({
      title: "Delete Table",
      description: "Table deletion functionality would be implemented here.",
      variant: "destructive",
    });
  };

  const handleSaveSchema = (tableName: string, columns: any[]) => {
    toast({
      title: "Schema Updated",
      description: `Schema for table "${tableName}" has been updated successfully.`,
    });
  };

  const handleEditRow = (rowData: any) => {
    toast({
      title: "Edit Row",
      description: `Edit row with ID: ${rowData.id || 'unknown'}`,
    });
    console.log('Edit row data:', rowData);
  };

  const handleDeleteRow = (rowData: any) => {
    toast({
      title: "Delete Row",
      description: `Row with ID ${rowData.id || 'unknown'} would be deleted.`,
      variant: "destructive",
    });
    console.log('Delete row data:', rowData);
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
              onCreateDatabase={handleCreateDatabase}
              onCreateTable={handleCreateTable}
              onEditDatabase={handleEditDatabase}
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
                onEditSchema={() => setSchemaEditorOpen(true)}
                onAddRow={handleAddRow}
                onEditRow={handleEditRow}
                onDeleteRow={handleDeleteRow}
                onImportTable={handleImportTable}
                onUpdateTable={handleUpdateTable}
              />
            </main>

            <SchemaEditor
              isOpen={schemaEditorOpen}
              onClose={() => setSchemaEditorOpen(false)}
              tableName={currentTable?.name || ""}
              columns={[]}
              onSave={handleSaveSchema}
            />

            <CreateDatabaseDialog
              isOpen={createDatabaseOpen}
              onClose={() => setCreateDatabaseOpen(false)}
              onCreateDatabase={handleCreateDatabaseSubmit}
            />

            <CreateTableDialog
              isOpen={createTableOpen}
              onClose={() => setCreateTableOpen(false)}
              onCreateTable={handleCreateTableSubmit}
            />

            <EditDatabaseDialog
              isOpen={editDatabaseOpen}
              onClose={() => {
                setEditDatabaseOpen(false);
                setEditingDatabase(null);
              }}
              onEditDatabase={handleEditDatabaseSubmit}
              currentName={editingDatabase?.name || ''}
            />

            <AddRowDialog
              isOpen={addRowOpen}
              onClose={() => setAddRowOpen(false)}
              onAddRow={handleAddRowSubmit}
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
