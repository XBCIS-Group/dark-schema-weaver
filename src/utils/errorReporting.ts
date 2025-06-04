import { logger } from './logger';
import { getMemoryUsage } from './security';

interface ErrorReport {
  id: string;
  timestamp: Date;
  message: string;
  stack?: string;
  userAgent: string;
  url: string;
  userId?: string;
  context?: any;
  memoryUsage?: { used: number; limit: number };
}

class ErrorReporter {
  private reports: ErrorReport[] = [];
  private maxReports = 50; // Prevent memory leaks

  generateReport(error: Error, context?: any): ErrorReport {
    const report: ErrorReport = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      context,
      memoryUsage: getMemoryUsage()
    };

    this.reports.push(report);
    
    // Keep only recent reports
    if (this.reports.length > this.maxReports) {
      this.reports = this.reports.slice(-this.maxReports);
    }

    logger.error('Error reported', report);
    return report;
  }

  getReports(): ErrorReport[] {
    return [...this.reports];
  }

  clearReports(): void {
    this.reports = [];
  }

  // For production, you might want to send these to a monitoring service
  exportReports(): string {
    return JSON.stringify(this.reports, null, 2);
  }
}

export const errorReporter = new ErrorReporter();

// Global error handler
export const setupGlobalErrorHandling = () => {
  window.addEventListener('error', (event) => {
    errorReporter.generateReport(new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorReporter.generateReport(new Error(`Unhandled promise rejection: ${event.reason}`), {
      type: 'unhandledrejection',
      reason: event.reason
    });
  });
};
