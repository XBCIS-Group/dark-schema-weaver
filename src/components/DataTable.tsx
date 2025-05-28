
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

interface DataTableProps {
  columns: Column[];
  rows: Record<string, any>[];
  onEditRow: (rowData: any) => void;
  onDeleteRow: (rowData: any) => void;
}

export function DataTable({ columns, rows, onEditRow, onDeleteRow }: DataTableProps) {
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
  );
}
