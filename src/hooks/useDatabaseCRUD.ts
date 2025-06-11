
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/types/database';

export function useDatabaseCRUD() {
  const [databases, setDatabases] = useState<Database[]>([]);
  const { toast } = useToast();

  const createDatabase = (name: string) => {
    const newDatabase: Database = {
      id: Date.now().toString(),
      name,
      tables: [],
    };
    
    setDatabases(prev => [...prev, newDatabase]);
    toast({
      title: "Database Created",
      description: `Database "${name}" has been created successfully.`,
    });
  };

  const editDatabase = (name: string, editingDatabase: Database | null) => {
    if (!editingDatabase) return;

    setDatabases(prev => prev.map(db => 
      db.id === editingDatabase.id 
        ? { ...db, name }
        : db
    ));

    toast({
      title: "Database Updated",
      description: `Database has been renamed to "${name}".`,
    });
  };

  const deleteDatabase = (id: string) => {
    const database = databases.find(db => db.id === id);
    if (database) {
      setDatabases(prev => prev.filter(db => db.id !== id));
      toast({
        title: "Database Deleted",
        description: `Database "${database.name}" has been deleted.`,
        variant: "destructive",
      });
    }
  };

  return {
    databases,
    setDatabases,
    createDatabase,
    editDatabase,
    deleteDatabase,
  };
}
