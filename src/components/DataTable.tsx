
import React from 'react';
import { Edit, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Column } from '@/types/database';
import { format } from 'date-fns';

interface DataTableProps {
  columns: Column[];
  rows: Record<string, any>[];
  onEditRow: (rowData: any) => void;
  onDeleteRow: (rowData: any) => void;
}

export function DataTable({ columns, rows, onEditRow, onDeleteRow }: DataTableProps) {
  const formatCellValue = (value: any, column: Column) => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">NULL</span>;
    }

    // Handle Date objects
    if (value instanceof Date) {
      return format(value, 'PPP');
    }

    // Handle date strings for date type columns
    if (column.type === 'date' && typeof value === 'string') {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return format(date, 'PPP');
        }
      } catch (error) {
        console.warn('Invalid date value:', value);
      }
    }

    // Handle boolean values
    if (typeof value === 'boolean') {
      return value ? 'True' : 'False';
    }

    // Convert everything else to string
    return String(value);
  };

  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
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
          {rows.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {formatCellValue(row[column.name], column)}
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
  );
}
