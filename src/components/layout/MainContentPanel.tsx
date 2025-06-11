
import React from 'react';
import { ResizablePanel } from '@/components/ui/resizable';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TableView } from '@/components/TableView';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Table } from '@/types/database';

interface MainContentPanelProps {
  currentTable: Table | null;
  onEditSchema: () => void;
  onAddRow: () => void;
  onEditRow: (rowData: Record<string, any>) => void;
  onDeleteRow: (rowData: any) => void;
  onImportTable: (tableData: Table) => void;
  onUpdateTable: (tableData: Table) => void;
  onDeleteTable: () => void;
}

export function MainContentPanel({
  currentTable,
  onEditSchema,
  onAddRow,
  onEditRow,
  onDeleteRow,
  onImportTable,
  onUpdateTable,
  onDeleteTable,
}: MainContentPanelProps) {
  return (
    <ResizablePanel defaultSize={80} minSize={50}>
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="border-b border-border p-4 bg-card flex items-center justify-between flex-shrink-0">
          <SidebarTrigger />
          <ThemeToggle />
        </div>
        <div className="flex-1 overflow-auto">
          <ErrorBoundary>
            <TableView
              table={currentTable}
              onEditSchema={onEditSchema}
              onAddRow={onAddRow}
              onEditRow={onEditRow}
              onDeleteRow={onDeleteRow}
              onImportTable={onImportTable}
              onUpdateTable={onUpdateTable}
              onDeleteTable={onDeleteTable}
            />
          </ErrorBoundary>
        </div>
      </main>
    </ResizablePanel>
  );
}
