
import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  Plus, 
  Settings, 
  Import, 
  Download,
  Trash2,
  Edit,
  Search
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Column {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
}

interface TableType {
  id: string;
  name: string;
  columns: Column[];
  rows: Record<string, any>[];
}

interface Database {
  id: string;
  name: string;
  tables: TableType[];
}

interface DatabaseSidebarProps {
  databases: Database[];
  selectedDatabase: string | null;
  selectedTable: string | null;
  onSelectDatabase: (id: string) => void;
  onSelectTable: (id: string) => void;
  onCreateDatabase: () => void;
  onCreateTable: () => void;
  onEditDatabase: (id: string) => void;
  onEditTable: (id: string) => void;
  onDeleteDatabase: (id: string) => void;
  onDeleteTable: (id: string) => void;
  onImportDatabase: () => void;
  onExportDatabase: () => void;
}

export function DatabaseSidebar({
  databases,
  selectedDatabase,
  selectedTable,
  onSelectDatabase,
  onSelectTable,
  onCreateDatabase,
  onCreateTable,
  onEditDatabase,
  onEditTable,
  onDeleteDatabase,
  onDeleteTable,
  onImportDatabase,
  onExportDatabase,
}: DatabaseSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDatabases, setExpandedDatabases] = useState<Set<string>>(new Set());

  const filteredDatabases = databases.filter(db =>
    db.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    db.tables.some(table => table.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDatabaseClick = (databaseId: string) => {
    setExpandedDatabases(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(databaseId)) {
        newExpanded.delete(databaseId);
      } else {
        newExpanded.add(databaseId);
      }
      return newExpanded;
    });
    onSelectDatabase(databaseId);
  };

  return (
    <div className="h-full flex flex-col border-r border-border bg-sidebar">
      <div className="px-4 py-6 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-6 w-6 text-primary flex-shrink-0" />
          <h1 className="text-xl font-bold text-sidebar-foreground truncate">Database Manager</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-2">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-sm font-medium text-sidebar-foreground/70">Databases</span>
            <Button size="sm" variant="ghost" onClick={onCreateDatabase} className="h-6 w-6 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {filteredDatabases.map((database) => (
              <div key={database.id}>
                <div className="flex items-center justify-between group">
                  <Button
                    variant={selectedDatabase === database.id ? "secondary" : "ghost"}
                    className="flex-1 justify-start gap-2 h-8 px-2"
                    onClick={() => handleDatabaseClick(database.id)}
                  >
                    <Database className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-sm">{database.name}</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border border-border">
                      <DropdownMenuItem onClick={() => onEditDatabase(database.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Database
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteDatabase(database.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Database
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {expandedDatabases.has(database.id) && (
                  <div className="ml-6 mt-2 space-y-1">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xs text-muted-foreground">Tables</span>
                      <Button size="sm" variant="ghost" onClick={onCreateTable} className="h-4 w-4 p-0">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    {database.tables.map((table) => (
                      <div key={table.id} className="flex items-center justify-between group">
                        <Button
                          variant={selectedTable === table.id ? "secondary" : "ghost"}
                          size="sm"
                          className="flex-1 justify-start gap-2 h-7 px-2"
                          onClick={() => onSelectTable(table.id)}
                        >
                          <Table className="h-3 w-3 flex-shrink-0" />
                          <span className="text-xs truncate">{table.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
                            {table.rows.length}
                          </span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Settings className="h-2 w-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border border-border">
                            <DropdownMenuItem onClick={() => onEditTable(table.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Table
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDeleteTable(table.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Table
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={onImportDatabase}>
            <Import className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Import</span>
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={onExportDatabase}>
            <Download className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Export</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
