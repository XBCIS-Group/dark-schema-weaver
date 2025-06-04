
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: any;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment) {
      // In production, only log warnings and errors
      return level === 'warn' || level === 'error';
    }
    return true;
  }

  private createLogEntry(level: LogLevel, message: string, context?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date(),
      context
    };
  }

  info(message: string, context?: any): void {
    const entry = this.createLogEntry('info', message, context);
    this.logs.push(entry);
    
    if (this.shouldLog('info')) {
      console.log(`[INFO] ${message}`, context || '');
    }
  }

  warn(message: string, context?: any): void {
    const entry = this.createLogEntry('warn', message, context);
    this.logs.push(entry);
    
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, context || '');
    }
  }

  error(message: string, context?: any): void {
    const entry = this.createLogEntry('error', message, context);
    this.logs.push(entry);
    
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, context || '');
    }
  }

  debug(message: string, context?: any): void {
    const entry = this.createLogEntry('debug', message, context);
    this.logs.push(entry);
    
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, context || '');
    }
  }

  // Get recent logs for error reporting
  getRecentLogs(count: number = 10): LogEntry[] {
    return this.logs.slice(-count);
  }

  // Clear logs to prevent memory leaks
  clearLogs(): void {
    this.logs = [];
  }
}

export const logger = new Logger();
