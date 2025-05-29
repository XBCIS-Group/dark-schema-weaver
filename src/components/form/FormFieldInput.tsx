
import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Column } from '@/types/database';

interface FormFieldInputProps {
  column: Column;
  value: any;
  onChange: (value: string | boolean | Date) => void;
  hasError: boolean;
}

export function FormFieldInput({ column, value, onChange, hasError }: FormFieldInputProps) {
  if (column.type === 'boolean') {
    return (
      <Checkbox
        id={column.id}
        checked={value || false}
        onCheckedChange={(checked) => onChange(checked)}
      />
    );
  }

  if (column.type === 'date') {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              hasError && "border-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => date && onChange(date)}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    );
  }

  if (column.type === 'number' || column.type === 'decimal') {
    return (
      <Input
        id={column.id}
        type="number"
        step={column.type === 'decimal' ? '0.01' : '1'}
        placeholder={`Enter ${column.name.toLowerCase()}...`}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={hasError ? 'border-red-500' : ''}
      />
    );
  }

  return (
    <Input
      id={column.id}
      placeholder={`Enter ${column.name.toLowerCase()}...`}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={hasError ? 'border-red-500' : ''}
    />
  );
}
