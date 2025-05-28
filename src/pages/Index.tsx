
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { DatabaseSidebar } from '@/components/DatabaseSidebar';
import { TableView } from '@/components/TableView';
import { SchemaEditor } from '@/components/SchemaEditor';
import { useToast } from '@/hooks/use-toast';

// Mock data - in a real app, this would come from your backend
const mockDatabases = [
  {
    id: 'db1',
    name: 'E-commerce',
    tables: [
      {
        id: 'table1',
        name: 'users',
        columns: 15,
        rows: 1248,
      },
      {
        id: 'table2',
        name: 'products',
        columns: 12,
        rows: 3456,
      },
      {
        id: 'table3',
        name: 'orders',
        columns: 8,
        rows: 5672,
      },
    ],
  },
  {
    id: 'db2',
    name: 'Analytics',
    tables: [
      {
        id: 'table4',
        name: 'events',
        columns: 20,
        rows: 98234,
      },
      {
        id: 'table5',
        name: 'sessions',
        columns: 10,
        rows: 12456,
      },
    ],
  },
];

const mockTableData = {
  table1: {
    id: 'table1',
    name: 'users',
    columns: [
      { id: 'col1', name: 'id', type: 'INTEGER', nullable: false, primaryKey: true, unique: true },
      { id: 'col2', name: 'email', type: 'VARCHAR(255)', nullable: false, primaryKey: false, unique: true },
      { id: 'col3', name: 'first_name', type: 'VARCHAR(100)', nullable: false, primaryKey: false, unique: false },
      { id: 'col4', name: 'last_name', type: 'VARCHAR(100)', nullable: false, primaryKey: false, unique: false },
      { id: 'col5', name: 'created_at', type: 'TIMESTAMP', nullable: false, primaryKey: false, unique: false },
    ],
    rows: [
      { id: 1, email: 'john@example.com', first_name: 'John', last_name: 'Doe', created_at: '2024-01-15 10:30:00' },
      { id: 2, email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith', created_at: '2024-01-16 14:22:00' },
      { id: 3, email: 'bob@example.com', first_name: 'Bob', last_name: 'Johnson', created_at: '2024-01-17 09:15:00' },
    ],
  },
  table2: {
    id: 'table2',
    name: 'products',
    columns: [
      { id: 'col1', name: 'id', type: 'INTEGER', nullable: false, primaryKey: true, unique: true },
      { id: 'col2', name: 'name', type: 'VARCHAR(255)', nullable: false, primaryKey: false, unique: false },
      { id: 'col3', name: 'price', type: 'DECIMAL(10,2)', nullable: false, primaryKey: false, unique: false },
      { id: 'col4', name: 'category', type: 'VARCHAR(100)', nullable: true, primaryKey: false, unique: false },
      { id: 'col5', name: 'in_stock', type: 'BOOLEAN', nullable: false, primaryKey: false, unique: false },
    ],
    rows: [
      { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', in_stock: true },
      { id: 2, name: 'Coffee Mug', price: 12.99, category: 'Home', in_stock: true },
      { id: 3, name: 'Book', price: 24.99, category: 'Education', in_stock: false },
    ],
  },
};

const Index = () => {
  const [databases] = useState(mockDatabases);
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>('db1');
  const [selectedTable, setSelectedTable] = useState<string | null>('table1');
  const [schemaEditorOpen, setSchemaEditorOpen] = useState(false);
  const { toast } = useToast();

  const currentTable = selectedTable ? mockTableData[selectedTable as keyof typeof mockTableData] : null;

  const handleCreateDatabase = () => {
    toast({
      title: "Create Database",
      description: "Database creation functionality would be implemented here.",
    });
  };

  const handleCreateTable = () => {
    toast({
      title: "Create Table",
      description: "Table creation functionality would be implemented here.",
    });
  };

  const handleDeleteDatabase = (id: string) => {
    toast({
      title: "Delete Database",
      description: "Database deletion functionality would be implemented here.",
      variant: "destructive",
    });
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
                table={currentTable}
                onEditSchema={() => setSchemaEditorOpen(true)}
                onAddRow={() => toast({ title: "Add Row", description: "Row addition form would open here." })}
                onEditRow={(id) => toast({ title: "Edit Row", description: `Edit row ${id} form would open here.` })}
                onDeleteRow={(id) => toast({ title: "Delete Row", description: `Row ${id} would be deleted.`, variant: "destructive" })}
                onImportData={handleImportData}
                onExportData={handleExportData}
              />
            </main>

            {currentTable && (
              <SchemaEditor
                isOpen={schemaEditorOpen}
                onClose={() => setSchemaEditorOpen(false)}
                tableName={currentTable.name}
                columns={currentTable.columns}
                onSave={handleSaveSchema}
              />
            )}
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
};

export default Index;
