
import React, { useState } from 'react';
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
import { validateTableName, sanitizeInput } from '@/utils/validation';

interface CreateTableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTable: (name: string) => void;
}

export function CreateTableDialog({
  isOpen,
  onClose,
  onCreateTable,
}: CreateTableDialogProps) {
  const [tableName, setTableName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sanitized = sanitizeInput(tableName);
    const validation = validateTableName(sanitized);
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid table name');
      return;
    }
    
    onCreateTable(sanitized);
    setTableName('');
    setError(null);
    onClose();
  };

  const handleClose = () => {
    setTableName('');
    setError(null);
    onClose();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTableName(value);
    
    if (error) {
      const sanitized = sanitizeInput(value);
      const validation = validateTableName(sanitized);
      if (validation.isValid) {
        setError(null);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Table</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="table-name">Table Name</Label>
              <Input
                id="table-name"
                value={tableName}
                onChange={handleNameChange}
                placeholder="Enter table name"
                autoFocus
                maxLength={50}
              />
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Must start with a letter and contain only letters, numbers, and underscores
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!tableName.trim()}>
              Create Table
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
