
import React, { useState, useEffect } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { Column, ColumnType } from '@/types/database';

interface SchemaEditorProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  columns: Column[];
  onSave: (columns: Column[]) => void;
}

export function SchemaEditor({
  isOpen,
  onClose,
  tableName,
  columns,
  onSave,
}: SchemaEditorProps) {
  const [editedColumns, setEditedColumns] = useState<Column[]>([]);

  useEffect(() => {
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
      defaultValue: null,
    };
    setEditedColumns([...editedColumns, newColumn]);
  };

  const removeColumn = (id: string) => {
    setEditedColumns(editedColumns.filter(col => col.id !== id));
  };

  const updateColumn = (id: string, field: keyof Column, value: any) => {
    setEditedColumns(editedColumns.map(col => 
      col.id === id ? { ...col, [field]: value } : col
    ));
  };

  const handleSave = () => {
    // Validate that all columns have names
    const validColumns = editedColumns.filter(col => col.name.trim() !== '');
    if (validColumns.length !== editedColumns.length) {
      alert('All columns must have names');
      return;
    }
    
    onSave(validColumns);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Schema - {tableName}</DialogTitle>
          <DialogDescription>
            Modify the structure of your table by adding, removing, or editing columns.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Columns</h3>
            <Button onClick={addColumn} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
          </div>

          <div className="space-y-3">
            {editedColumns.map((column, index) => (
              <div key={column.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Column {index + 1}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeColumn(column.id)}
                    disabled={editedColumns.length === 1}
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
                      onChange={(e) => updateColumn(column.id, 'name', e.target.value)}
                      placeholder="Enter column name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`type-${column.id}`}>Data Type</Label>
                    <Select
                      value={column.type}
                      onValueChange={(value: ColumnType) => updateColumn(column.id, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
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
                      onChange={(e) => updateColumn(column.id, 'defaultValue', e.target.value || null)}
                      placeholder="Enter default value"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id={`nullable-${column.id}`}
                      checked={column.nullable}
                      onChange={(e) => updateColumn(column.id, 'nullable', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor={`nullable-${column.id}`}>Allow Null</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
