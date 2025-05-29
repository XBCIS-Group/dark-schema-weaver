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

          <div className="space-y-4">
            {editedColumns.map((column, index) => (
              <div key={column.id} className="p-4 border rounded-lg space-y-4">
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
                      onChange={(e) => updateColumn(column.id, 'defaultValue', e.target.value || null)}
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
                          onChange={(e) => updateColumn(column.id, 'nullable', e.target.checked)}
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
                          onChange={(e) => updateColumn(column.id, 'primaryKey', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor={`primary-${column.id}`} className="text-sm">Primary Key</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`unique-${column.id}`}
                          checked={column.unique}
                          onChange={(e) => updateColumn(column.id, 'unique', e.target.checked)}
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
                          onChange={(e) => updateColumn(column.id, 'autoIncrement', e.target.checked)}
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
