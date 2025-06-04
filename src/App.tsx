
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { setupGlobalErrorHandling } from "@/utils/errorReporting";
import { logger } from "@/utils/logger";
import { isMemoryUsageHigh } from "@/utils/security";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        logger.warn('Query failed', { failureCount, error: error.message });
        return failureCount < 3;
      },
    },
    mutations: {
      onError: (error) => {
        logger.error('Mutation failed', { error: error.message });
      },
    },
  },
});

const App = () => {
  useEffect(() => {
    // Setup global error handling
    setupGlobalErrorHandling();
    logger.info('Application initialized with security enhancements');

    // Memory monitoring
    const memoryCheck = setInterval(() => {
      if (isMemoryUsageHigh()) {
        logger.warn('High memory usage detected');
      }
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(memoryCheck);
      logger.clearLogs(); // Cleanup logs on unmount
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
