
import React from 'react';
import { TableHeader } from '@/components/TableHeader';
import { SchemaOverview } from '@/components/SchemaOverview';
import { DataTable } from '@/components/DataTable';
import { EmptyTableState } from '@/components/EmptyTableState';
import { useTableView } from '@/hooks/useTableView';
import { Column, Table as TableData } from '@/types/database';

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
  const {
    filter,
    setFilter,
    filteredRows,
    handleImportTable,
    handleExportTable,
  } = useTableView(table, onImportTable);

  if (!table) {
    return <EmptyTableState onImportTable={handleImportTable} />;
  }

  return (
    <div className="flex-1 flex flex-col">
      <TableHeader
        tableName={table.name}
        columnCount={table.columns.length}
        rowCount={table.rows.length}
        filter={filter}
        onFilterChange={setFilter}
        onImportTable={handleImportTable}
        onExportTable={handleExportTable}
        onEditSchema={onEditSchema}
        onAddRow={onAddRow}
      />

      <SchemaOverview columns={table.columns} />

      <DataTable
        columns={table.columns}
        rows={filteredRows}
        onEditRow={onEditRow}
        onDeleteRow={onDeleteRow}
      />
    </div>
  );
}
