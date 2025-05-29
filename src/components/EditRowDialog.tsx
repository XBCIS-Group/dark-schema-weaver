
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Column } from '@/types/database';

interface EditRowDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEditRow: (rowData: Record<string, any>) => void;
  columns: Column[];
  rowData: Record<string, any> | null;
  tableName: string;
}

export function EditRowDialog({
  isOpen,
  onClose,
  onEditRow,
  columns,
  rowData,
  tableName,
}: EditRowDialogProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (rowData) {
      setFormData({ ...rowData });
    }
  }, [rowData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditRow(formData);
    onClose();
  };

  const handleInputChange = (columnName: string, value: string | boolean | Date) => {
    setFormData(prev => ({
      ...prev,
      [columnName]: value
    }));
  };

  const renderInputField = (column: Column) => {
    const value = formData[column.name];

    if (column.type === 'boolean') {
      return (
        <Checkbox
          id={column.name}
          checked={value || false}
          onCheckedChange={(checked) => handleInputChange(column.name, checked)}
          disabled={column.primaryKey}
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
                "col-span-3 justify-start text-left font-normal",
                !value && "text-muted-foreground"
              )}
              disabled={column.primaryKey}
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
          id={column.name}
          type="number"
          step={column.type === 'decimal' ? '0.01' : '1'}
          value={value || ''}
          onChange={(e) => handleInputChange(column.name, e.target.value)}
          disabled={column.primaryKey}
          className="col-span-3"
          placeholder={column.nullable ? 'NULL' : `Enter ${column.name}`}
        />
      );
    }

    return (
      <Input
        id={column.name}
        value={value || ''}
        onChange={(e) => handleInputChange(column.name, e.target.value)}
        disabled={column.primaryKey}
        className="col-span-3"
        placeholder={column.nullable ? 'NULL' : `Enter ${column.name}`}
      />
    );
  };

  if (!rowData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Row in {tableName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            {columns.map((column) => (
              <div key={column.id} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={column.name} className="text-right">
                  {column.name}
                  {column.primaryKey && <span className="text-xs text-muted-foreground ml-1">(PK)</span>}
                </Label>
                {renderInputField(column)}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
