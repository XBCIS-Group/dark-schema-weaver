
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Column } from '@/types/database';
import { validateColumnValue, sanitizeInput } from '@/utils/validation';

interface FormFieldInputProps {
  column: Column;
  value: any;
  onChange: (value: string | boolean | Date) => void;
  hasError?: boolean;
}

export function FormFieldInput({ column, value, onChange, hasError }: FormFieldInputProps) {
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const handleValueChange = (newValue: any) => {
    const validation = validateColumnValue(newValue, column.type);
    setValidationError(validation.isValid ? null : validation.error || null);
    onChange(newValue);
  };

  const getInputClassName = () => {
    const baseClasses = "w-full";
    return hasError || validationError ? `${baseClasses} border-red-500` : baseClasses;
  };

  switch (column.type) {
    case 'text':
    case 'varchar':
      if (value && typeof value === 'string' && value.length > 100) {
        return (
          <div>
            <Textarea
              value={value || ''}
              onChange={(e) => handleValueChange(sanitizeInput(e.target.value))}
              placeholder={`Enter ${column.name}`}
              className={getInputClassName()}
              maxLength={1000}
            />
            {validationError && (
              <p className="text-sm text-red-500 mt-1">{validationError}</p>
            )}
          </div>
        );
      }
      return (
        <div>
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => handleValueChange(sanitizeInput(e.target.value))}
            placeholder={`Enter ${column.name}`}
            className={getInputClassName()}
            maxLength={1000}
          />
          {validationError && (
            <p className="text-sm text-red-500 mt-1">{validationError}</p>
          )}
        </div>
      );

    case 'number':
    case 'decimal':
      return (
        <div>
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={`Enter ${column.name}`}
            className={getInputClassName()}
            step={column.type === 'decimal' ? '0.01' : '1'}
          />
          {validationError && (
            <p className="text-sm text-red-500 mt-1">{validationError}</p>
          )}
        </div>
      );

    case 'boolean':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={Boolean(value)}
            onCheckedChange={(checked) => handleValueChange(checked)}
          />
          <span className="text-sm">True</span>
        </div>
      );

    case 'date':
      return (
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`${getInputClassName()} justify-start text-left font-normal`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => handleValueChange(date || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {validationError && (
            <p className="text-sm text-red-500 mt-1">{validationError}</p>
          )}
        </div>
      );

    case 'uuid':
      return (
        <div>
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => handleValueChange(sanitizeInput(e.target.value))}
            placeholder="Enter UUID"
            className={getInputClassName()}
            pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
          />
          {validationError && (
            <p className="text-sm text-red-500 mt-1">{validationError}</p>
          )}
        </div>
      );

    default:
      return (
        <div>
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => handleValueChange(sanitizeInput(e.target.value))}
            placeholder={`Enter ${column.name}`}
            className={getInputClassName()}
            maxLength={1000}
          />
          {validationError && (
            <p className="text-sm text-red-500 mt-1">{validationError}</p>
          )}
        </div>
      );
  }
}
