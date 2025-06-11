
export const validateAccessFile = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > 50 * 1024 * 1024) {
    return { isValid: false, error: 'Database file must be less than 50MB' };
  }
  
  const extension = file.name.toLowerCase();
  if (!extension.endsWith('.mdb') && !extension.endsWith('.accdb') && !extension.endsWith('.xlsx')) {
    return { isValid: false, error: 'File must have a .mdb, .accdb, or .xlsx extension' };
  }
  
  return { isValid: true };
};
