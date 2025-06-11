
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="dbms-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <ErrorBoundary>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <ResizablePanelGroup 
                direction="horizontal" 
                className="min-h-screen w-full"
              >
                {children}
              </ResizablePanelGroup>
            </div>
          </SidebarProvider>
        </ErrorBoundary>
      </div>
    </ThemeProvider>
  );
}
