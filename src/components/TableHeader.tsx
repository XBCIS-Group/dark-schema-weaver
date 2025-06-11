
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
      <div className="flex flex-col space-y-4">
        {/* Title and Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold truncate">{tableName}</h2>
            <p className="text-muted-foreground text-sm">
              {columnCount} columns • {rowCount} rows
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 sm:flex-shrink-0">
            <Button variant="outline" size="sm" onClick={onImportTable} className="text-xs sm:text-sm">
              <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Import</span>
              <span className="hidden sm:inline"> CSV</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onExportTable} className="text-xs sm:text-sm">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Export</span>
              <span className="hidden sm:inline"> CSV</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onEditSchema} className="text-xs sm:text-sm">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Schema</span>
            </Button>
            <Button variant="destructive" size="sm" onClick={onDeleteTable} className="text-xs sm:text-sm">
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Delete</span>
            </Button>
            <Button onClick={onAddRow} size="sm" className="text-xs sm:text-sm">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Add</span>
              <span className="hidden sm:inline"> Row</span>
            </Button>
          </div>
        </div>

        {/* Filter Section */}
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
          <Button variant="outline" size="sm" className="self-start sm:self-center">
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
