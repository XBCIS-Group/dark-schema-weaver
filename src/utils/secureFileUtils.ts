
import { ColumnType, Database, Table } from '@/types/database';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_JSON_MIME_TYPES = ['application/json', 'text/json'];
const ALLOWED_CSV_MIME_TYPES = ['text/csv', 'application/csv', 'text/plain'];

export const validateFileSize = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }
  return { isValid: true };
};

export const validateJsonFile = (file: File): { isValid: boolean; error?: string } => {
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }
  
  if (!file.name.toLowerCase().endsWith('.json')) {
    return { isValid: false, error: 'File must have a .json extension' };
  }
  
  if (!ALLOWED_JSON_MIME_TYPES.includes(file.type) && file.type !== '') {
    return { isValid: false, error: 'Invalid file type. Please select a JSON file.' };
  }
  
  return { isValid: true };
};

export const validateCsvFile = (file: File): { isValid: boolean; error?: string } => {
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }
  
  if (!file.name.toLowerCase().endsWith('.csv')) {
    return { isValid: false, error: 'File must have a .csv extension' };
  }
  
  if (!ALLOWED_CSV_MIME_TYPES.includes(file.type) && file.type !== '') {
    return { isValid: false, error: 'Invalid file type. Please select a CSV file.' };
  }
  
  return { isValid: true };
};

export const validateDatabaseSchema = (data: any): { isValid: boolean; error?: string; database?: Database } => {
  try {
    if (!data || typeof data !== 'object') {
      return { isValid: false, error: 'Invalid file format. Expected a JSON object.' };
    }
    
    if (!data.name || typeof data.name !== 'string') {
      return { isValid: false, error: 'Database must have a valid name.' };
    }
    
    if (!Array.isArray(data.tables)) {
      return { isValid: false, error: 'Database must have a tables array.' };
    }
    
    // Validate each table
    for (const table of data.tables) {
      if (!table.name || typeof table.name !== 'string') {
        return { isValid: false, error: 'All tables must have valid names.' };
      }
      
      if (!Array.isArray(table.columns)) {
        return { isValid: false, error: 'All tables must have a columns array.' };
      }
      
      if (!Array.isArray(table.rows)) {
        return { isValid: false, error: 'All tables must have a rows array.' };
      }
      
      // Validate columns
      for (const column of table.columns) {
        if (!column.name || typeof column.name !== 'string') {
          return { isValid: false, error: 'All columns must have valid names.' };
        }
        
        const validTypes: ColumnType[] = ['text', 'varchar', 'number', 'decimal', 'boolean', 'date', 'uuid'];
        if (!validTypes.includes(column.type)) {
          return { isValid: false, error: `Invalid column type: ${column.type}` };
        }
      }
    }
    
    return { isValid: true, database: data };
  } catch (error) {
    return { isValid: false, error: 'Invalid JSON format.' };
  }
};

export const secureReadFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        if (result.length > MAX_FILE_SIZE) {
          reject(new Error('File content too large'));
          return;
        }
        resolve(result);
      } catch (error) {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
