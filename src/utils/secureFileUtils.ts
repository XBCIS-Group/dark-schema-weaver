
import { ColumnType, Database, Table } from '@/types/database';
import { logger } from './logger';
import { fileOperationLimiter, deepSanitize } from './security';
import { errorReporter } from './errorReporting';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_JSON_MIME_TYPES = ['application/json', 'text/json'];
const ALLOWED_CSV_MIME_TYPES = ['text/csv', 'application/csv', 'text/plain'];

export const validateFileSize = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    logger.warn('File size validation failed', { size: file.size, maxSize: MAX_FILE_SIZE });
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
    logger.warn('JSON file extension validation failed', { filename: file.name });
    return { isValid: false, error: 'File must have a .json extension' };
  }
  
  if (!ALLOWED_JSON_MIME_TYPES.includes(file.type) && file.type !== '') {
    logger.warn('JSON MIME type validation failed', { mimeType: file.type });
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
    logger.warn('CSV file extension validation failed', { filename: file.name });
    return { isValid: false, error: 'File must have a .csv extension' };
  }
  
  if (!ALLOWED_CSV_MIME_TYPES.includes(file.type) && file.type !== '') {
    logger.warn('CSV MIME type validation failed', { mimeType: file.type });
    return { isValid: false, error: 'Invalid file type. Please select a CSV file.' };
  }
  
  return { isValid: true };
};

export const validateDatabaseSchema = (data: any): { isValid: boolean; error?: string; database?: Database } => {
  try {
    // Rate limiting for schema validation
    if (!fileOperationLimiter.isAllowed('schema-validation')) {
      logger.warn('Schema validation rate limited');
      return { isValid: false, error: 'Too many validation attempts. Please wait a moment.' };
    }

    if (!data || typeof data !== 'object') {
      logger.warn('Invalid schema format', { dataType: typeof data });
      return { isValid: false, error: 'Invalid file format. Expected a JSON object.' };
    }
    
    // Deep sanitize the input data
    const sanitizedData = deepSanitize(data);
    
    if (!sanitizedData.name || typeof sanitizedData.name !== 'string') {
      logger.warn('Database name validation failed', { name: sanitizedData.name });
      return { isValid: false, error: 'Database must have a valid name.' };
    }
    
    if (!Array.isArray(sanitizedData.tables)) {
      logger.warn('Tables array validation failed', { tables: sanitizedData.tables });
      return { isValid: false, error: 'Database must have a tables array.' };
    }
    
    // Validate each table
    for (const table of sanitizedData.tables) {
      if (!table.name || typeof table.name !== 'string') {
        logger.warn('Table name validation failed', { tableName: table.name });
        return { isValid: false, error: 'All tables must have valid names.' };
      }
      
      if (!Array.isArray(table.columns)) {
        logger.warn('Table columns validation failed', { tableName: table.name });
        return { isValid: false, error: 'All tables must have a columns array.' };
      }
      
      if (!Array.isArray(table.rows)) {
        logger.warn('Table rows validation failed', { tableName: table.name });
        return { isValid: false, error: 'All tables must have a rows array.' };
      }
      
      // Validate columns
      for (const column of table.columns) {
        if (!column.name || typeof column.name !== 'string') {
          logger.warn('Column name validation failed', { columnName: column.name, tableName: table.name });
          return { isValid: false, error: 'All columns must have valid names.' };
        }
        
        const validTypes: ColumnType[] = ['text', 'varchar', 'number', 'decimal', 'boolean', 'date', 'uuid'];
        if (!validTypes.includes(column.type)) {
          logger.warn('Column type validation failed', { columnType: column.type, columnName: column.name });
          return { isValid: false, error: `Invalid column type: ${column.type}` };
        }
      }
    }
    
    logger.info('Database schema validation successful', { 
      databaseName: sanitizedData.name, 
      tableCount: sanitizedData.tables.length 
    });
    
    return { isValid: true, database: sanitizedData };
  } catch (error) {
    const err = error as Error;
    logger.error('Schema validation error', { error: err.message });
    errorReporter.generateReport(err, { context: 'schema-validation' });
    return { isValid: false, error: 'Invalid JSON format.' };
  }
};

export const secureReadFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Rate limiting for file reading
    if (!fileOperationLimiter.isAllowed('file-read')) {
      const error = new Error('Too many file read attempts. Please wait a moment.');
      logger.warn('File read rate limited', { filename: file.name });
      reject(error);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        if (result.length > MAX_FILE_SIZE) {
          const error = new Error('File content too large');
          logger.warn('File content size exceeded', { size: result.length });
          reject(error);
          return;
        }
        
        logger.info('File read successfully', { filename: file.name, size: result.length });
        resolve(result);
      } catch (error) {
        const err = error as Error;
        logger.error('File processing error', { error: err.message, filename: file.name });
        errorReporter.generateReport(err, { filename: file.name });
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      const error = new Error('Failed to read file');
      logger.error('FileReader error', { filename: file.name });
      errorReporter.generateReport(error, { filename: file.name });
      reject(error);
    };
    
    reader.readAsText(file);
  });
};
