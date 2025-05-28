
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

  const handleInputChange = (columnName: string, value: string) => {
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

    columns.forEach(column => {
      const value = rowData[column.name];
      
      if (!column.nullable && (!value || value.toString().trim() === '')) {
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Row</DialogTitle>
          <DialogDescription>
            Add a new row to the {tableName} table. Fill in the required fields.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {columns.map((column) => (
            <div key={column.id} className="space-y-2">
              <Label htmlFor={column.id} className="flex items-center gap-2">
                {column.name}
                {!column.nullable && <span className="text-red-500">*</span>}
                {column.primaryKey && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">PK</span>
                )}
              </Label>
              <Input
                id={column.id}
                placeholder={`Enter ${column.name.toLowerCase()}...`}
                value={rowData[column.name] || ''}
                onChange={(e) => handleInputChange(column.name, e.target.value)}
                className={errors[column.name] ? 'border-red-500' : ''}
              />
              {errors[column.name] && (
                <p className="text-sm text-red-500">{errors[column.name]}</p>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Row
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
