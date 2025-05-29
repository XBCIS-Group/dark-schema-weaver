
import React from 'react';
import { Label } from '@/components/ui/label';
import { FormFieldInput } from './FormFieldInput';
import { Column } from '@/types/database';

interface FormFieldProps {
  column: Column;
  value: any;
  onChange: (value: string | boolean | Date) => void;
  error?: string;
}

export function FormField({ column, value, onChange, error }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={column.id} className="flex items-center gap-2">
        {column.name}
        {!column.nullable && <span className="text-red-500">*</span>}
        {column.unique && (
          <span className="text-xs bg-amber-100 text-amber-800 px-1 rounded">UNIQUE</span>
        )}
      </Label>
      <FormFieldInput
        column={column}
        value={value}
        onChange={onChange}
        hasError={!!error}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
