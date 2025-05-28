
import React from 'react';
import { 
  Upload,
  Download,
  Settings,
  Plus,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TableHeaderProps {
  tableName: string;
  columnCount: number;
  rowCount: number;
  filter: string;
  onFilterChange: (value: string) => void;
  onImportTable: () => void;
  onExportTable: () => void;
  onEditSchema: () => void;
  onAddRow: () => void;
}

export function TableHeader({
  tableName,
  columnCount,
  rowCount,
  filter,
  onFilterChange,
  onImportTable,
  onExportTable,
  onEditSchema,
  onAddRow,
}: TableHeaderProps) {
  return (
    <div className="border-b border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{tableName}</h2>
          <p className="text-muted-foreground">
            {columnCount} columns • {rowCount} rows
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onImportTable}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" onClick={onExportTable}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={onEditSchema}>
            <Settings className="h-4 w-4 mr-2" />
            Schema
          </Button>
          <Button onClick={onAddRow}>
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter data..."
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
