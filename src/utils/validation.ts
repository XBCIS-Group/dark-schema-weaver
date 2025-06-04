
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
};

export const validateDatabaseName = (name: string): { isValid: boolean; error?: string } => {
  const sanitized = sanitizeInput(name);
  
  if (!sanitized) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (sanitized.length > 50) {
    return { isValid: false, error: 'Name must be 50 characters or less' };
  }
  
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(sanitized)) {
    return { isValid: false, error: 'Name must start with a letter and contain only letters, numbers, and underscores' };
  }
  
  return { isValid: true };
};

export const validateTableName = (name: string): { isValid: boolean; error?: string } => {
  return validateDatabaseName(name); // Same rules for now
};

export const validateColumnName = (name: string): { isValid: boolean; error?: string } => {
  const sanitized = sanitizeInput(name);
  
  if (!sanitized) {
    return { isValid: false, error: 'Column name is required' };
  }
  
  if (sanitized.length > 30) {
    return { isValid: false, error: 'Column name must be 30 characters or less' };
  }
  
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(sanitized)) {
    return { isValid: false, error: 'Column name must start with a letter and contain only letters, numbers, and underscores' };
  }
  
  return { isValid: true };
};

export const validateColumnValue = (value: any, columnType: string): { isValid: boolean; error?: string } => {
  if (value === null || value === undefined || value === '') {
    return { isValid: true }; // Nullable validation is handled elsewhere
  }
  
  switch (columnType) {
    case 'number':
      if (isNaN(Number(value))) {
        return { isValid: false, error: 'Value must be a valid number' };
      }
      break;
    case 'text':
    case 'varchar':
      if (typeof value === 'string' && value.length > 1000) {
        return { isValid: false, error: 'Text value is too long (max 1000 characters)' };
      }
      break;
    case 'boolean':
      if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
        return { isValid: false, error: 'Value must be true or false' };
      }
      break;
    case 'date':
      if (!(value instanceof Date) && isNaN(Date.parse(value))) {
        return { isValid: false, error: 'Value must be a valid date' };
      }
      break;
  }
  
  return { isValid: true };
};
