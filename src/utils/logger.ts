type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: unknown;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private isDevelopment = import.meta.env.DEV;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, context?: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      data
    };

    // Add to internal log
    this.logs.push(entry);
    
    // Keep logs under limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output in development
    if (this.isDevelopment) {
      const contextStr = context ? `[${context}]` : '';
      const logMessage = `${entry.timestamp} ${contextStr} ${message}`;
      
      switch (level) {
        case 'debug':
          console.debug(logMessage, data);
          break;
        case 'info':
          console.info(logMessage, data);
          break;
        case 'warn':
          console.warn(logMessage, data);
          break;
        case 'error':
          console.error(logMessage, data);
          break;
      }
    }
  }

  public debug(message: string, context?: string, data?: unknown): void {
    this.log('debug', message, context, data);
  }

  public info(message: string, context?: string, data?: unknown): void {
    this.log('info', message, context, data);
  }

  public warn(message: string, context?: string, data?: unknown): void {
    this.log('warn', message, context, data);
  }

  public error(message: string, context?: string, data?: unknown): void {
    this.log('error', message, context, data);
  }

  public getLogs(level?: LogLevel): ReadonlyArray<LogEntry> {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Performance logging
  public time(label: string): void {
    if (this.isDevelopment) {
      console.time(label);
    }
  }

  public timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }
  }

  // Component lifecycle logging
  public componentMount(componentName: string, props?: unknown): void {
    this.debug(`Component mounted: ${componentName}`, 'React', props);
  }

  public componentUnmount(componentName: string): void {
    this.debug(`Component unmounted: ${componentName}`, 'React');
  }

  public componentUpdate(componentName: string, prevProps?: unknown, nextProps?: unknown): void {
    this.debug(`Component updated: ${componentName}`, 'React', { prevProps, nextProps });
  }

  // User interaction logging
  public userAction(action: string, details?: unknown): void {
    this.info(`User action: ${action}`, 'UserInteraction', details);
  }

  // API logging
  public apiRequest(method: string, url: string, data?: unknown): void {
    this.info(`API Request: ${method} ${url}`, 'API', data);
  }

  public apiResponse(method: string, url: string, status: number, data?: unknown): void {
    const level = status >= 400 ? 'error' : 'info';
    this.log(level, `API Response: ${method} ${url} - ${status}`, 'API', data);
  }

  // Performance metrics
  public performanceMetric(name: string, value: number, unit = 'ms'): void {
    this.info(`Performance: ${name} = ${value}${unit}`, 'Performance');
  }
}

// Singleton instance
export const logger = Logger.getInstance();

// React hook for component logging
export const useLogger = (componentName: string) => {
  React.useEffect(() => {
    logger.componentMount(componentName);
    return () => {
      logger.componentUnmount(componentName);
    };
  }, [componentName]);

  const logUserAction = React.useCallback((action: string, details?: unknown) => {
    logger.userAction(`${componentName}: ${action}`, details);
  }, [componentName]);

  const logError = React.useCallback((error: unknown, context?: string) => {
    logger.error(`${componentName}: ${context || 'Error'}`, componentName, error);
  }, [componentName]);

  return { logUserAction, logError };
};

// Performance measurement hook
export const usePerformance = (name: string) => {
  const startTime = React.useRef<number>();

  const start = React.useCallback(() => {
    startTime.current = performance.now();
    logger.time(name);
  }, [name]);

  const end = React.useCallback(() => {
    if (startTime.current) {
      const duration = performance.now() - startTime.current;
      logger.performanceMetric(name, Math.round(duration));
      logger.timeEnd(name);
    }
  }, [name]);

  return { start, end };
};