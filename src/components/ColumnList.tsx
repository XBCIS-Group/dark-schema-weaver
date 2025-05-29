
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Column } from '@/types/database';
import { ColumnEditor } from '@/components/ColumnEditor';

interface ColumnListProps {
  columns: Column[];
  onAddColumn: () => void;
  onRemoveColumn: (id: string) => void;
  onUpdateColumn: (id: string, field: keyof Column, value: any) => void;
  draggedIndex: number | null;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
}

export function ColumnList({
  columns,
  onAddColumn,
  onRemoveColumn,
  onUpdateColumn,
  draggedIndex,
  onDragStart,
  onDragOver,
  onDragEnd,
}: ColumnListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Columns</h3>
        <Button onClick={onAddColumn} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Column
        </Button>
      </div>

      <div className="space-y-4">
        {columns.map((column, index) => (
          <ColumnEditor
            key={column.id}
            column={column}
            index={index}
            canDelete={columns.length > 1}
            onUpdate={onUpdateColumn}
            onRemove={onRemoveColumn}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            draggedIndex={draggedIndex}
          />
        ))}
      </div>
    </div>
  );
}
