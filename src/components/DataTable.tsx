
import React, { useState } from 'react';
import { Edit, Trash2, Settings, GripVertical } from 'lucide-react';
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
  onReorderRows?: (newRows: Record<string, any>[]) => void;
}

export function DataTable({ columns, rows, onEditRow, onDeleteRow, onReorderRows }: DataTableProps) {
  const [localRows, setLocalRows] = useState(rows);
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);

  // Update local rows when props change
  React.useEffect(() => {
    setLocalRows(rows);
  }, [rows]);

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

  const handleRowDragStart = (index: number) => {
    setDraggedRowIndex(index);
  };

  const handleRowDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedRowIndex === null || draggedRowIndex === index) return;

    const newRows = [...localRows];
    const draggedRow = newRows[draggedRowIndex];
    
    // Remove the dragged row and insert it at the new position
    newRows.splice(draggedRowIndex, 1);
    newRows.splice(index, 0, draggedRow);
    
    setLocalRows(newRows);
    setDraggedRowIndex(index);
  };

  const handleRowDragEnd = () => {
    setDraggedRowIndex(null);
    if (onReorderRows) {
      onReorderRows(localRows);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {onReorderRows && <TableHead className="w-8"></TableHead>}
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
          {localRows.map((row, index) => (
            <TableRow 
              key={index}
              draggable={!!onReorderRows}
              onDragStart={() => onReorderRows && handleRowDragStart(index)}
              onDragOver={(e) => onReorderRows && handleRowDragOver(e, index)}
              onDragEnd={() => onReorderRows && handleRowDragEnd()}
              style={{
                opacity: draggedRowIndex === index ? 0.5 : 1,
                cursor: onReorderRows ? 'move' : 'default'
              }}
            >
              {onReorderRows && (
                <TableCell>
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                </TableCell>
              )}
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
