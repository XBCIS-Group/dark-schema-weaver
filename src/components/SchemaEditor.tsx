
import React from 'react';
import { Column } from '@/types/database';
import { SchemaEditorDialog } from '@/components/SchemaEditorDialog';

interface SchemaEditorProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  columns: Column[];
  onSave: (columns: Column[]) => void;
}

export function SchemaEditor(props: SchemaEditorProps) {
  return <SchemaEditorDialog {...props} />;
}
