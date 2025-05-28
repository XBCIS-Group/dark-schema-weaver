
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { DatabaseSidebar } from '@/components/DatabaseSidebar';
import { TableView } from '@/components/TableView';
import { SchemaEditor } from '@/components/SchemaEditor';
import { CreateDatabaseDialog } from '@/components/CreateDatabaseDialog';
import { useToast } from '@/hooks/use-toast';

interface Database {
  id: string;
  name: string;
  tables: any[];
}

const Index = () => {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [schemaEditorOpen, setSchemaEditorOpen] = useState(false);
  const [createDatabaseOpen, setCreateDatabaseOpen] = useState(false);
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

  const handleCreateTable = () => {
    toast({
      title: "Create Table",
      description: "Table creation functionality would be implemented here.",
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

  const handleImportData = () => {
    toast({
      title: "Import Data",
      description: "Data import functionality would be implemented here.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Data",
      description: "Data export functionality would be implemented here.",
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
              onDeleteDatabase={handleDeleteDatabase}
              onDeleteTable={handleDeleteTable}
            />
            <main className="flex-1 flex flex-col">
              <div className="border-b border-border p-4 bg-card">
                <SidebarTrigger />
              </div>
              <TableView
                table={null}
                onEditSchema={() => setSchemaEditorOpen(true)}
                onAddRow={() => toast({ title: "Add Row", description: "Row addition form would open here." })}
                onEditRow={handleEditRow}
                onDeleteRow={handleDeleteRow}
                onImportData={handleImportData}
                onExportData={handleExportData}
              />
            </main>

            <SchemaEditor
              isOpen={schemaEditorOpen}
              onClose={() => setSchemaEditorOpen(false)}
              tableName=""
              columns={[]}
              onSave={handleSaveSchema}
            />

            <CreateDatabaseDialog
              isOpen={createDatabaseOpen}
              onClose={() => setCreateDatabaseOpen(false)}
              onCreateDatabase={handleCreateDatabaseSubmit}
            />
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
};

export default Index;
