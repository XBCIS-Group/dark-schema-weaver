
import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Download,
  Upload,
  RefreshCw,
  Settings,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createFileInput, readFile, parseCSV, csvToTable, tableToCSV, downloadFile } from '@/utils/fileUtils';
import { useToast } from '@/hooks/use-toast';

interface Column {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
}

interface TableData {
  id: string;
  name: string;
  columns: Column[];
  rows: Record<string, any>[];
}

interface TableViewProps {
  table: TableData | null;
  onEditSchema: () => void;
  onAddRow: () => void;
  onEditRow: (rowData: any) => void;
  onDeleteRow: (rowData: any) => void;
  onImportTable: (tableData: TableData) => void;
  onUpdateTable: (tableData: TableData) => void;
}

export function TableView({
  table,
  onEditSchema,
  onAddRow,
  onEditRow,
  onDeleteRow,
  onImportTable,
  onUpdateTable,
}: TableViewProps) {
  const [filter, setFilter] = useState('');
  const { toast } = useToast();

  const handleImportTable = async () => {
    try {
      const file = await createFileInput('.csv');
      if (!file) return;

      const csvText = await readFile(file);
      const { headers, rows } = parseCSV(csvText);
      
      const tableName = file.name.replace('.csv', '');
      const newTable = csvToTable(headers, rows, tableName);
      
      onImportTable(newTable);
      toast({
        title: "Table Imported",
        description: `Successfully imported ${rows.length} rows from ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import CSV file. Please check the file format.",
        variant: "destructive",
      });
    }
  };

  const handleExportTable = () => {
    if (!table) return;

    try {
      const csvData = tableToCSV(table);
      downloadFile(csvData, `${table.name}.csv`, 'text/csv');
      toast({
        title: "Table Exported",
        description: `Successfully exported ${table.name} as CSV`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export table data.",
        variant: "destructive",
      });
    }
  };

  if (!table) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Table Selected</h3>
          <p className="text-muted-foreground mb-4">
            Select a table from the sidebar to view its data and schema
          </p>
          <Button onClick={handleImportTable}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV File
          </Button>
        </div>
      </div>
    );
  }

  const filteredRows = table.rows.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(filter.toLowerCase())
    )
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{table.name}</h2>
            <p className="text-muted-foreground">
              {table.columns.length} columns • {table.rows.length} rows
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImportTable}>
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button variant="outline" onClick={handleExportTable}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={onEditSchema}>
              <Settings className="h-4 w-4 mr-2" />
              Schema
            </Button>
            <Button onClick={onAddRow}>
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter data..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Schema Overview */}
      <div className="border-b border-border p-4 bg-muted/20">
        <h3 className="text-sm font-medium mb-2">Columns</h3>
        <div className="flex flex-wrap gap-2">
          {table.columns.map((column) => (
            <Badge
              key={column.id}
              variant={column.primaryKey ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              {column.name}
              <span className="text-xs opacity-70">({column.type})</span>
              {column.primaryKey && <span className="text-xs">PK</span>}
              {column.unique && <span className="text-xs">U</span>}
            </Badge>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {table.columns.map((column) => (
                <TableHead key={column.id} className="font-medium">
                  <div className="flex items-center gap-2">
                    {column.name}
                    {column.primaryKey && (
                      <Badge variant="outline" className="text-xs">PK</Badge>
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={index}>
                {table.columns.map((column) => (
                  <TableCell key={column.id}>
                    {row[column.name] ?? (
                      <span className="text-muted-foreground italic">NULL</span>
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border border-border">
                      <DropdownMenuItem onClick={() => onEditRow(row)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteRow(row)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
