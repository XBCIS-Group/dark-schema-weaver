
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

interface EditDatabaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEditDatabase: (name: string) => void;
  currentName: string;
}

export function EditDatabaseDialog({
  isOpen,
  onClose,
  onEditDatabase,
  currentName,
}: EditDatabaseDialogProps) {
  const [databaseName, setDatabaseName] = useState('');

  useEffect(() => {
    setDatabaseName(currentName);
  }, [currentName, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (databaseName.trim() && databaseName.trim() !== currentName) {
      onEditDatabase(databaseName.trim());
      onClose();
    }
  };

  const handleClose = () => {
    setDatabaseName(currentName);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Database</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="database-name">Database Name</Label>
              <Input
                id="database-name"
                value={databaseName}
                onChange={(e) => setDatabaseName(e.target.value)}
                placeholder="Enter database name"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!databaseName.trim() || databaseName.trim() === currentName}>
              Update Database
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
