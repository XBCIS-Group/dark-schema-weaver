
import { useState } from 'react';
import { Column } from '@/types/database';

interface UseAddRowFormProps {
  columns: Column[];
  onSubmit: (rowData: Record<string, any>) => void;
  onClose: () => void;
}

export function useAddRowForm({ columns, onSubmit, onClose }: UseAddRowFormProps) {
  console.log('useAddRowForm initialized with columns:', columns);
  
  const [rowData, setRowData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter out primary key columns since they shouldn't be manually entered
  const editableColumns = columns.filter(column => !column.primaryKey);
  console.log('Editable columns:', editableColumns);

  const handleInputChange = (columnName: string, value: string | boolean | Date) => {
    console.log('Input change:', columnName, value, typeof value);
    setRowData(prev => {
      const updated = { ...prev, [columnName]: value };
      console.log('Updated rowData:', updated);
      return updated;
    });
    if (errors[columnName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[columnName];
        return newErrors;
      });
    }
  };

  const validateRow = (): boolean => {
    console.log('Validating row with data:', rowData);
    const newErrors: Record<string, string> = {};

    editableColumns.forEach(column => {
      const value = rowData[column.name];
      console.log(`Validating ${column.name}:`, value, 'nullable:', column.nullable);
      
      if (!column.nullable && (value === undefined || value === null || value === '')) {
        newErrors[column.name] = 'This field is required';
        console.log(`Validation error for ${column.name}: required field is empty`);
      }
    });

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    console.log('=== SUBMIT CLICKED ===');
    console.log('Current rowData:', rowData);
    console.log('Available columns:', columns);
    console.log('Editable columns:', editableColumns);
    
    try {
      if (validateRow()) {
        // Generate a unique ID for the new row
        const primaryKeyColumn = columns.find(col => col.primaryKey);
        console.log('Primary key column found:', primaryKeyColumn);
        
        const newRow = { ...rowData };
        
        // Only add an ID if there's a primary key column and it's not already in the row data
        if (primaryKeyColumn && !newRow[primaryKeyColumn.name]) {
          newRow[primaryKeyColumn.name] = Date.now();
          console.log('Generated primary key:', newRow[primaryKeyColumn.name]);
        }
        
        console.log('=== SUBMITTING NEW ROW ===');
        console.log('Final row data:', newRow);
        console.log('Calling onSubmit function...');
        
        onSubmit(newRow);
        
        console.log('onSubmit completed, clearing form...');
        setRowData({});
        setErrors({});
        onClose();
        console.log('Form cleared and dialog closed');
      } else {
        console.log('Validation failed with errors:', errors);
      }
    } catch (error) {
      console.error('=== ERROR IN SUBMIT ===');
      console.error('Error details:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    }
  };

  const handleClose = () => {
    console.log('Dialog closing, clearing form data');
    setRowData({});
    setErrors({});
    onClose();
  };

  return {
    rowData,
    errors,
    editableColumns,
    handleInputChange,
    handleSubmit,
    handleClose,
  };
}
