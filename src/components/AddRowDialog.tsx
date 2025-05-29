
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/FormField';
import { useAddRowForm } from '@/hooks/useAddRowForm';
import { Column } from '@/types/database';

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
  const {
    rowData,
    errors,
    editableColumns,
    handleInputChange,
    handleSubmit,
    handleClose,
  } = useAddRowForm({ columns, onSubmit: onAddRow, onClose });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
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
        
        <div className="space-y-4">
          {editableColumns.map((column) => (
            <FormField
              key={column.id}
              column={column}
              value={rowData[column.name]}
              onChange={(value) => handleInputChange(column.name, value)}
              error={errors[column.name]}
            />
          ))}
          {editableColumns.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No editable fields available. All columns are primary keys.
            </p>
          )}
        </div>

        <DialogFooter>
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
