
import { useState } from 'react';
import { Column } from '@/types/database';

interface UseAddRowFormProps {
  columns: Column[];
  onSubmit: (rowData: Record<string, any>) => void;
  onClose: () => void;
}

export function useAddRowForm({ columns, onSubmit, onClose }: UseAddRowFormProps) {
  const [rowData, setRowData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter out primary key columns since they shouldn't be manually entered
  const editableColumns = columns.filter(column => !column.primaryKey);

  const handleInputChange = (columnName: string, value: string | boolean | Date) => {
    console.log('Input change:', columnName, value);
    setRowData(prev => ({ ...prev, [columnName]: value }));
    if (errors[columnName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[columnName];
        return newErrors;
      });
    }
  };

  const validateRow = (): boolean => {
    const newErrors: Record<string, string> = {};

    editableColumns.forEach(column => {
      const value = rowData[column.name];
      
      if (!column.nullable && (value === undefined || value === null || value === '')) {
        newErrors[column.name] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    console.log('Submit clicked with data:', rowData);
    
    if (validateRow()) {
      // Generate a unique ID for the new row
      const primaryKeyColumn = columns.find(col => col.primaryKey);
      const newRow = { ...rowData };
      
      // Only add an ID if there's a primary key column and it's not already in the row data
      if (primaryKeyColumn && !newRow[primaryKeyColumn.name]) {
        newRow[primaryKeyColumn.name] = Date.now();
      }
      
      console.log('Submitting new row:', newRow);
      
      try {
        onSubmit(newRow);
        setRowData({});
        setErrors({});
        onClose();
      } catch (error) {
        console.error('Error submitting row:', error);
      }
    } else {
      console.log('Validation failed with errors:', errors);
    }
  };

  const handleClose = () => {
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
