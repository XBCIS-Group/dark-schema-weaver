
import React from 'react';
import { 
  Upload,
  Download,
  Settings,
  Plus,
  Filter,
  RefreshCw,
  Trash2
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
  onDeleteTable: () => void;
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
  onDeleteTable,
}: TableHeaderProps) {
  return (
    <div className="border-b border-border p-4 bg-background">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold truncate">{tableName}</h2>
          <p className="text-muted-foreground text-sm">
            {columnCount} columns • {rowCount} rows
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onImportTable} className="flex-shrink-0">
            <Upload className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Import CSV</span>
            <span className="sm:hidden">Import</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onExportTable} className="flex-shrink-0">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onEditSchema} className="flex-shrink-0">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Schema</span>
          </Button>
          <Button variant="destructive" size="sm" onClick={onDeleteTable} className="flex-shrink-0">
            <Trash2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Delete Table</span>
            <span className="sm:hidden">Delete</span>
          </Button>
          <Button onClick={onAddRow} size="sm" className="flex-shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Row</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter data..."
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" className="self-start">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
