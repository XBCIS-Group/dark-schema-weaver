
import React, { useEffect, useState } from 'react';
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
  const [sidebarSize, setSidebarSize] = useState(() => {
    const stored = localStorage.getItem('dbms-sidebar-size');
    return stored ? parseInt(stored, 10) : 25;
  });

  useEffect(() => {
    localStorage.setItem('dbms-sidebar-size', sidebarSize.toString());
  }, [sidebarSize]);

  return (
    <ResizablePanel 
      defaultSize={sidebarSize}
      minSize={15}
      maxSize={40}
      className="min-w-[200px] max-w-[400px]"
      onResize={(size) => setSidebarSize(size)}
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
