
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface Column {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
  autoIncrement: boolean;
}

interface SchemaOverviewProps {
  columns: Column[];
}

export function SchemaOverview({ columns }: SchemaOverviewProps) {
  return (
    <div className="border-b border-border p-4 bg-muted/20">
      <h3 className="text-sm font-medium mb-2">Columns</h3>
      <div className="flex flex-wrap gap-2">
        {columns.map((column) => (
          <Badge
            key={column.id}
            variant={column.primaryKey ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {column.name}
            <span className="text-xs opacity-70">({column.type})</span>
            {column.primaryKey && <span className="text-xs">PK</span>}
            {column.unique && <span className="text-xs">U</span>}
            {column.autoIncrement && <span className="text-xs">AI</span>}
          </Badge>
        ))}
      </div>
    </div>
  );
}
