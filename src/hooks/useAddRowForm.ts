
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
    if (validateRow()) {
      const newRow = { ...rowData, id: Date.now() };
      onSubmit(newRow);
      setRowData({});
      setErrors({});
      onClose();
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
