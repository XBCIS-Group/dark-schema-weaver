import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Key, 
  Check, 
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Column } from '@/types/database';

interface SchemaEditorProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  columns: Column[];
  onSave: (tableName: string, columns: Column[]) => void;
}

const DATA_TYPES = [
  'VARCHAR(255)',
  'TEXT',
  'INTEGER',
  'BIGINT',
  'DECIMAL',
  'FLOAT',
  'BOOLEAN',
  'DATE',
  'DATETIME',
  'TIMESTAMP',
  'JSON',
  'UUID',
];

export function SchemaEditor({
  isOpen,
  onClose,
  tableName: initialTableName,
  columns: initialColumns,
  onSave,
}: SchemaEditorProps) {
  const [tableName, setTableName] = useState(initialTableName);
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);

  const addColumn = () => {
    const newColumn: Column = {
      id: `col_${Date.now()}`,
      name: `column_${columns.length + 1}`,
      type: 'VARCHAR(255)',
      nullable: true,
      primaryKey: false,
      unique: false,
    };
    setColumns([...columns, newColumn]);
    setEditingColumn(newColumn.id);
  };

  const updateColumn = (id: string, updates: Partial<Column>) => {
    setColumns(columns.map(col => 
      col.id === id ? { ...col, ...updates } : col
    ));
  };

  const deleteColumn = (id: string) => {
    setColumns(columns.filter(col => col.id !== id));
  };

  const moveColumn = (id: string, direction: 'up' | 'down') => {
    const index = columns.findIndex(col => col.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === columns.length - 1)
    ) {
      return;
    }

    const newColumns = [...columns];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newColumns[index], newColumns[newIndex]] = [newColumns[newIndex], newColumns[index]];
    setColumns(newColumns);
  };

  const handleSave = () => {
    onSave(tableName, columns);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Table Schema</DialogTitle>
          <DialogDescription>
            Modify the structure and constraints of your table
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Table Name */}
          <div className="space-y-2">
            <Label htmlFor="tableName">Table Name</Label>
            <Input
              id="tableName"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Enter table name"
            />
          </div>

          {/* Columns */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Columns</h3>
              <Button onClick={addColumn}>
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead className="w-[150px]">Type</TableHead>
                    <TableHead className="w-[100px]">Nullable</TableHead>
                    <TableHead className="w-[100px]">Primary Key</TableHead>
                    <TableHead className="w-[100px]">Unique</TableHead>
                    <TableHead className="w-[150px]">Default</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {columns.map((column, index) => (
                    <TableRow key={column.id}>
                      <TableCell>
                        {editingColumn === column.id ? (
                          <Input
                            value={column.name}
                            onChange={(e) => updateColumn(column.id, { name: e.target.value })}
                            onBlur={() => setEditingColumn(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') setEditingColumn(null);
                            }}
                            autoFocus
                          />
                        ) : (
                          <div 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setEditingColumn(column.id)}
                          >
                            {column.name}
                            {column.primaryKey && <Key className="h-3 w-3 text-primary" />}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={column.type}
                          onValueChange={(value) => updateColumn(column.id, { type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border border-border">
                            {DATA_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={column.nullable}
                          onCheckedChange={(checked) => 
                            updateColumn(column.id, { nullable: checked })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={column.primaryKey}
                          onCheckedChange={(checked) => {
                            // Only one primary key allowed
                            if (checked) {
                              setColumns(columns.map(col => 
                                col.id === column.id 
                                  ? { ...col, primaryKey: true, nullable: false }
                                  : { ...col, primaryKey: false }
                              ));
                            } else {
                              updateColumn(column.id, { primaryKey: false });
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={column.unique}
                          onCheckedChange={(checked) => 
                            updateColumn(column.id, { unique: checked })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={(column as any).defaultValue || ''}
                          onChange={(e) => 
                            updateColumn(column.id, { defaultValue: e.target.value } as any)
                          }
                          placeholder="Default value"
                          className="text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveColumn(column.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveColumn(column.id, 'down')}
                            disabled={index === columns.length - 1}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteColumn(column.id)}
                            disabled={columns.length === 1}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" />
            Save Schema
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
