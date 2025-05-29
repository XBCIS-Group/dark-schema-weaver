
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
    <Sidebar className="border-r border-border w-full h-full">
      <SidebarHeader className="px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-6 w-6 text-primary flex-shrink-0" />
          <h1 className="text-xl font-bold truncate">Database Manager</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between px-2">
            <span className="truncate">Databases</span>
            <Button size="sm" variant="ghost" onClick={onCreateDatabase} className="flex-shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredDatabases.map((database) => (
                <div key={database.id} className="w-full">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => handleDatabaseClick(database.id)}
                      isActive={selectedDatabase === database.id}
                      className="flex items-center justify-between w-full min-w-0"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Database className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{database.name}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0 flex-shrink-0"
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
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {expandedDatabases.has(database.id) && (
                    <div className="ml-4 mt-2 space-y-1 w-full">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-xs text-muted-foreground truncate">Tables</span>
                        <Button size="sm" variant="ghost" onClick={onCreateTable} className="h-6 w-6 p-0 flex-shrink-0">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      {database.tables.map((table) => (
                        <SidebarMenuItem key={table.id}>
                          <SidebarMenuButton
                            onClick={() => onSelectTable(table.id)}
                            isActive={selectedTable === table.id}
                            size="sm"
                            className="flex items-center justify-between w-full min-w-0"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <Table className="h-3 w-3 flex-shrink-0" />
                              <span className="text-sm truncate">{table.name}</span>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <span className="text-xs text-muted-foreground">
                                {table.rows.length}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-4 w-4 p-0"
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
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex gap-2 w-full">
          <Button size="sm" variant="outline" className="flex-1 min-w-0" onClick={onImportDatabase}>
            <Import className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Import</span>
          </Button>
          <Button size="sm" variant="outline" className="flex-1 min-w-0" onClick={onExportDatabase}>
            <Download className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Export</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
