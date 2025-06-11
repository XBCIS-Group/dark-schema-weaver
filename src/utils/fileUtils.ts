import { ColumnType } from '@/types/database';

export const downloadFile = (data: string, filename: string, type: string) => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const createFileInput = (accept: string): Promise<File | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      resolve(file || null);
    };
    input.click();
  });
};

export const parseCSV = (csvText: string): { headers: string[], rows: string[][] } => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = lines.slice(1).map(line => 
    line.split(',').map(cell => cell.trim().replace(/"/g, ''))
  );
  return { headers, rows };
};

export const csvToTable = (headers: string[], rows: string[][], tableName: string) => {
  const columns = headers.map((header, index) => ({
    id: `col_${index}`,
    name: header,
    type: 'text' as ColumnType,
    nullable: true,
    primaryKey: index === 0,
    unique: false,
    autoIncrement: false,
    defaultValue: null,
  }));

  const tableRows = rows.map((row, rowIndex) => {
    const rowData: Record<string, any> = {};
    headers.forEach((header, colIndex) => {
      rowData[header] = row[colIndex] || '';
    });
    rowData.id = rowIndex + 1;
    return rowData;
  });

  return {
    id: Date.now().toString(),
    name: tableName,
    columns,
    rows: tableRows,
  };
};

export const tableToCSV = (table: any): string => {
  const headers = table.columns.map((col: any) => col.name).join(',');
  const rows = table.rows.map((row: any) => 
    table.columns.map((col: any) => `"${row[col.name] || ''}"`)
  ).map((row: string[]) => row.join(',')).join('\n');
  
  return `${headers}\n${rows}`;
};
