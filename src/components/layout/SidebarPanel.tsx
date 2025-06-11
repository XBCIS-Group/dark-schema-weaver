
import React from 'react';
import { ResizablePanel } from '@/components/ui/resizable';
import { DatabaseSidebar } from '@/components/DatabaseSidebar';
import { Database } from '@/types/database';

interface SidebarPanelProps {
  databases: Database[];
  selectedDatabase: string | null;
  selectedTable: string | null;
  onSelectDatabase: (id: string | null) => void;
  onSelectTable: (id: string | null) => void;
  onCreateDatabase: () => void;
  onCreateTable: () => void;
  onEditDatabase: (id: string) => void;
  onEditTable: (id: string) => void;
  onDeleteDatabase: (id: string) => void;
  onDeleteTable: (id: string) => void;
  onImportDatabase: () => void;
  onExportDatabase: () => void;
}

export function SidebarPanel({
  databases,
  selectedDatabase,
  selectedTable,
  onSelectDatabase,
  onSelectTable,
  onCreateDatabase,
  onCreateTable,
  onEditDatabase,
  onEditTable,
  onDeleteDatabase,
  onDeleteTable,
  onImportDatabase,
  onExportDatabase,
}: SidebarPanelProps) {
  return (
    <ResizablePanel 
      defaultSize={20}
      minSize={15}
      maxSize={35}
      className="min-w-[250px] max-w-[500px]"
    >
      <DatabaseSidebar
        databases={databases}
        selectedDatabase={selectedDatabase}
        selectedTable={selectedTable}
        onSelectDatabase={onSelectDatabase}
        onSelectTable={onSelectTable}
        onCreateDatabase={onCreateDatabase}
        onCreateTable={onCreateTable}
        onEditDatabase={onEditDatabase}
        onEditTable={onEditTable}
        onDeleteDatabase={onDeleteDatabase}
        onDeleteTable={onDeleteTable}
        onImportDatabase={onImportDatabase}
        onExportDatabase={onExportDatabase}
      />
    </ResizablePanel>
  );
}
