
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

  const handleInputChange = (columnName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [columnName]: value
    }));
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
                <Input
                  id={column.name}
                  value={formData[column.name] || ''}
                  onChange={(e) => handleInputChange(column.name, e.target.value)}
                  disabled={column.primaryKey}
                  className="col-span-3"
                  placeholder={column.nullable ? 'NULL' : `Enter ${column.name}`}
                />
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
