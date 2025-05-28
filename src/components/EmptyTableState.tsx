
import React from 'react';
import { Settings, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyTableStateProps {
  onImportTable: () => void;
}

export function EmptyTableState({ onImportTable }: EmptyTableStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No Table Selected</h3>
        <p className="text-muted-foreground mb-4">
          Select a table from the sidebar to view its data and schema
        </p>
        <Button onClick={onImportTable}>
          <Upload className="h-4 w-4 mr-2" />
          Import CSV File
        </Button>
      </div>
    </div>
  );
}
