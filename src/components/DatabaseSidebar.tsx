
import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  Plus, 
  Settings, 
  Import, 
  Export,
  Trash2,
  Edit,
  Search,
  Sun,
  Moon
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
import { useTheme } from './ThemeProvider';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Database {
  id: string;
  name: string;
  tables: Table[];
}

interface Table {
  id: string;
  name: string;
  columns: number;
  rows: number;
}

interface DatabaseSidebarProps {
  databases: Database[];
  selectedDatabase: string | null;
  selectedTable: string | null;
  onSelectDatabase: (id: string) => void;
  onSelectTable: (id: string) => void;
  onCreateDatabase: () => void;
  onCreateTable: () => void;
  onDeleteDatabase: (id: string) => void;
  onDeleteTable: (id: string) => void;
}

export function DatabaseSidebar({
  databases,
  selectedDatabase,
  selectedTable,
  onSelectDatabase,
  onSelectTable,
  onCreateDatabase,
  onCreateTable,
  onDeleteDatabase,
  onDeleteTable,
}: DatabaseSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme, setTheme } = useTheme();

  const filteredDatabases = databases.filter(db =>
    db.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    db.tables.some(table => table.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Database Manager</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search databases and tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Databases</span>
            <Button size="sm" variant="ghost" onClick={onCreateDatabase}>
              <Plus className="h-4 w-4" />
            </Button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredDatabases.map((database) => (
                <div key={database.id}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => onSelectDatabase(database.id)}
                      isActive={selectedDatabase === database.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>{database.name}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border border-border">
                          <DropdownMenuItem onClick={() => onDeleteDatabase(database.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Database
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {selectedDatabase === database.id && (
                    <div className="ml-4 mt-2 space-y-1">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-xs text-muted-foreground">Tables</span>
                        <Button size="sm" variant="ghost" onClick={onCreateTable} className="h-6 w-6 p-0">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      {database.tables.map((table) => (
                        <SidebarMenuItem key={table.id}>
                          <SidebarMenuButton
                            onClick={() => onSelectTable(table.id)}
                            isActive={selectedTable === table.id}
                            size="sm"
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Table className="h-3 w-3" />
                              <span className="text-sm">{table.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {table.rows}
                            </span>
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
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Import className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button size="sm" variant="outline">
              <Export className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
