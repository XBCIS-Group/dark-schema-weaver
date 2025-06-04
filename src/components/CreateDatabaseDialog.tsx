
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
import { validateDatabaseName, sanitizeInput } from '@/utils/validation';

interface CreateDatabaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDatabase: (name: string) => void;
}

export function CreateDatabaseDialog({
  isOpen,
  onClose,
  onCreateDatabase,
}: CreateDatabaseDialogProps) {
  const [databaseName, setDatabaseName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sanitized = sanitizeInput(databaseName);
    const validation = validateDatabaseName(sanitized);
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid database name');
      return;
    }
    
    onCreateDatabase(sanitized);
    setDatabaseName('');
    setError(null);
    onClose();
  };

  const handleClose = () => {
    setDatabaseName('');
    setError(null);
    onClose();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDatabaseName(value);
    
    if (error) {
      const sanitized = sanitizeInput(value);
      const validation = validateDatabaseName(sanitized);
      if (validation.isValid) {
        setError(null);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Database</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="database-name">Database Name</Label>
              <Input
                id="database-name"
                value={databaseName}
                onChange={handleNameChange}
                placeholder="Enter database name"
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
            <Button type="submit" disabled={!databaseName.trim()}>
              Create Database
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
