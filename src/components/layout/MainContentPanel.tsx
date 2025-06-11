
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
    <ResizablePanel defaultSize={75} minSize={60} className="flex flex-col min-w-0 w-full">
      <main className="flex-1 flex flex-col h-full min-w-0 w-full">
        <div className="border-b border-border p-2 sm:p-4 bg-card flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <ThemeToggle />
        </div>
        <div className="flex-1 min-h-0 overflow-hidden w-full">
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
