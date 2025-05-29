
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Column } from '@/types/database';
import { ColumnList } from '@/components/ColumnList';

interface SchemaEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  columns: Column[];
  onSave: (columns: Column[]) => void;
}

export function SchemaEditorDialog({
  isOpen,
  onClose,
  tableName,
  columns,
  onSave,
}: SchemaEditorDialogProps) {
  const [editedColumns, setEditedColumns] = React.useState<Column[]>([]);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    setEditedColumns([...columns]);
  }, [columns]);

  const addColumn = () => {
    const newColumn: Column = {
      id: `col_${Date.now()}`,
      name: `column_${editedColumns.length + 1}`,
      type: 'text',
      nullable: true,
      primaryKey: false,
      unique: false,
      autoIncrement: false,
      defaultValue: null,
    };
    setEditedColumns([...editedColumns, newColumn]);
  };

  const removeColumn = (id: string) => {
    setEditedColumns(editedColumns.filter(col => col.id !== id));
  };

  const updateColumn = (id: string, field: keyof Column, value: any) => {
    setEditedColumns(editedColumns.map(col => {
      if (col.id === id) {
        const updatedCol = { ...col, [field]: value };
        
        // Auto-increment can only be applied to number columns
        if (field === 'autoIncrement' && value && col.type !== 'number') {
          updatedCol.type = 'number';
        }
        
        // If auto-increment is enabled, it should be unique and not nullable
        if (field === 'autoIncrement' && value) {
          updatedCol.unique = true;
          updatedCol.nullable = false;
        }
        
        // If type changes from number, disable auto-increment
        if (field === 'type' && value !== 'number') {
          updatedCol.autoIncrement = false;
        }
        
        return updatedCol;
      }
      return col;
    }));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newColumns = [...editedColumns];
    const draggedColumn = newColumns[draggedIndex];
    
    // Remove the dragged column and insert it at the new position
    newColumns.splice(draggedIndex, 1);
    newColumns.splice(index, 0, draggedColumn);
    
    setEditedColumns(newColumns);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    // Validate that all columns have names
    const validColumns = editedColumns.filter(col => col.name.trim() !== '');
    if (validColumns.length !== editedColumns.length) {
      alert('All columns must have names');
      return;
    }

    // Validate that only one primary key exists
    const primaryKeys = validColumns.filter(col => col.primaryKey);
    if (primaryKeys.length > 1) {
      alert('Only one column can be set as primary key');
      return;
    }
    
    onSave(validColumns);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Schema - {tableName}</DialogTitle>
          <DialogDescription>
            Modify the structure of your table by adding, removing, or editing columns. Drag columns to reorder them.
          </DialogDescription>
        </DialogHeader>

        <ColumnList
          columns={editedColumns}
          onAddColumn={addColumn}
          onRemoveColumn={removeColumn}
          onUpdateColumn={updateColumn}
          draggedIndex={draggedIndex}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Schema</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
