
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Column {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
}

interface AddRowDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRow: (rowData: Record<string, any>) => void;
  columns: Column[];
  tableName: string;
}

export function AddRowDialog({
  isOpen,
  onClose,
  onAddRow,
  columns,
  tableName,
}: AddRowDialogProps) {
  const [rowData, setRowData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter out primary key columns since they shouldn't be manually entered
  const editableColumns = columns.filter(column => !column.primaryKey);

  const handleInputChange = (columnName: string, value: string | boolean | Date) => {
    setRowData(prev => ({ ...prev, [columnName]: value }));
    if (errors[columnName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[columnName];
        return newErrors;
      });
    }
  };

  const validateRow = (): boolean => {
    const newErrors: Record<string, string> = {};

    editableColumns.forEach(column => {
      const value = rowData[column.name];
      
      if (!column.nullable && (value === undefined || value === null || value === '')) {
        newErrors[column.name] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateRow()) {
      const newRow = { ...rowData, id: Date.now() };
      onAddRow(newRow);
      setRowData({});
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setRowData({});
    setErrors({});
    onClose();
  };

  const renderInputField = (column: Column) => {
    const value = rowData[column.name];

    if (column.type === 'boolean') {
      return (
        <Checkbox
          id={column.id}
          checked={value || false}
          onCheckedChange={(checked) => handleInputChange(column.name, checked)}
        />
      );
    }

    if (column.type === 'date') {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground",
                errors[column.name] && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => date && handleInputChange(column.name, date)}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      );
    }

    if (column.type === 'number' || column.type === 'decimal') {
      return (
        <Input
          id={column.id}
          type="number"
          step={column.type === 'decimal' ? '0.01' : '1'}
          placeholder={`Enter ${column.name.toLowerCase()}...`}
          value={value || ''}
          onChange={(e) => handleInputChange(column.name, e.target.value)}
          className={errors[column.name] ? 'border-red-500' : ''}
        />
      );
    }

    return (
      <Input
        id={column.id}
        placeholder={`Enter ${column.name.toLowerCase()}...`}
        value={value || ''}
        onChange={(e) => handleInputChange(column.name, e.target.value)}
        className={errors[column.name] ? 'border-red-500' : ''}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Add New Row</DialogTitle>
          <DialogDescription>
            Add a new row to the {tableName} table. Fill in the required fields.
            {columns.some(col => col.primaryKey) && (
              <span className="block text-sm text-muted-foreground mt-1">
                Primary key fields are auto-generated and not shown.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 min-h-0 max-h-[400px]">
          <div className="space-y-4 pr-4">
            {editableColumns.map((column) => (
              <div key={column.id} className="space-y-2">
                <Label htmlFor={column.id} className="flex items-center gap-2">
                  {column.name}
                  {!column.nullable && <span className="text-red-500">*</span>}
                  {column.unique && (
                    <span className="text-xs bg-amber-100 text-amber-800 px-1 rounded">UNIQUE</span>
                  )}
                </Label>
                {renderInputField(column)}
                {errors[column.name] && (
                  <p className="text-sm text-red-500">{errors[column.name]}</p>
                )}
              </div>
            ))}
            {editableColumns.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No editable fields available. All columns are primary keys.
              </p>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={editableColumns.length === 0}>
            Add Row
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
