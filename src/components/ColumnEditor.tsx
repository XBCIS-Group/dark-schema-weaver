
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, GripVertical } from 'lucide-react';
import { Column, ColumnType } from '@/types/database';

interface ColumnEditorProps {
  column: Column;
  index: number;
  canDelete: boolean;
  onUpdate: (id: string, field: keyof Column, value: any) => void;
  onRemove: (id: string) => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  draggedIndex: number | null;
}

export function ColumnEditor({
  column,
  index,
  canDelete,
  onUpdate,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
  draggedIndex,
}: ColumnEditorProps) {
  return (
    <div 
      className="p-4 border rounded-lg space-y-4 bg-card"
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      style={{
        opacity: draggedIndex === index ? 0.5 : 1,
        cursor: 'move'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <span className="text-sm font-medium">Column {index + 1}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(column.id)}
          disabled={!canDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`name-${column.id}`}>Column Name</Label>
          <Input
            id={`name-${column.id}`}
            value={column.name}
            onChange={(e) => onUpdate(column.id, 'name', e.target.value)}
            placeholder="Enter column name"
          />
        </div>
        
        <div>
          <Label htmlFor={`type-${column.id}`}>Data Type</Label>
          <Select
            value={column.type}
            onValueChange={(value: ColumnType) => onUpdate(column.id, 'type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="varchar">Varchar</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="decimal">Decimal</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="uuid">UUID</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`default-${column.id}`}>Default Value</Label>
          <Input
            id={`default-${column.id}`}
            value={column.defaultValue || ''}
            onChange={(e) => onUpdate(column.id, 'defaultValue', e.target.value || null)}
            placeholder="Enter default value"
            disabled={column.autoIncrement}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Options</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`nullable-${column.id}`}
                checked={column.nullable}
                onChange={(e) => onUpdate(column.id, 'nullable', e.target.checked)}
                className="rounded"
                disabled={column.autoIncrement || column.primaryKey}
              />
              <Label htmlFor={`nullable-${column.id}`} className="text-sm">Allow Null</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`primary-${column.id}`}
                checked={column.primaryKey}
                onChange={(e) => onUpdate(column.id, 'primaryKey', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor={`primary-${column.id}`} className="text-sm">Primary Key</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`unique-${column.id}`}
                checked={column.unique}
                onChange={(e) => onUpdate(column.id, 'unique', e.target.checked)}
                className="rounded"
                disabled={column.autoIncrement || column.primaryKey}
              />
              <Label htmlFor={`unique-${column.id}`} className="text-sm">Unique</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`autoincrement-${column.id}`}
                checked={column.autoIncrement}
                onChange={(e) => onUpdate(column.id, 'autoIncrement', e.target.checked)}
                className="rounded"
                disabled={column.type !== 'number'}
              />
              <Label htmlFor={`autoincrement-${column.id}`} className="text-sm">
                Auto Increment {column.type !== 'number' && '(Numbers only)'}
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
