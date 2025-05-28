
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (databaseName.trim()) {
      onCreateDatabase(databaseName.trim());
      setDatabaseName('');
      onClose();
    }
  };

  const handleClose = () => {
    setDatabaseName('');
    onClose();
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
            <Button type="submit" disabled={!databaseName.trim()}>
              Create Database
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
