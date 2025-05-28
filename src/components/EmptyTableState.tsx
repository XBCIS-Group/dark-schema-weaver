
import React from 'react';
import { Settings } from 'lucide-react';

interface EmptyTableStateProps {
  onImportTable: () => void;
}

export function EmptyTableState({ onImportTable }: EmptyTableStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No Table Selected</h3>
        <p className="text-muted-foreground">
          Select a table from the sidebar to view its data and schema
        </p>
      </div>
    </div>
  );
}
