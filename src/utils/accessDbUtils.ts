
import { Database } from '@/types/database';
import { readExcelDatabase, exportToExcelFormat } from '@/utils/excelUtils';
import { readMDBDatabase } from '@/utils/mdbUtils';
import { validateAccessFile as validateFile } from '@/utils/fileValidation';
import { exportToJsonFormat, exportToAccessFormat } from '@/utils/exportUtils';
import { createAccessDatabase } from '@/utils/accessDbCreation';

// Re-export validation function
export { validateFile as validateAccessFile };

// Re-export creation function
export { createAccessDatabase };

// Re-export export functions
export { exportToJsonFormat, exportToAccessFormat };

// Re-export for compatibility
export { exportToExcelFormat };

export const readAccessDatabase = async (file: File): Promise<Database> => {
  const extension = file.name.toLowerCase();
  
  if (extension.endsWith('.xlsx')) {
    return readExcelDatabase(file);
  } else {
    return readMDBDatabase(file);
  }
};
