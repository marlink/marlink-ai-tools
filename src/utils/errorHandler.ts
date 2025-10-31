import React, { useState, useEffect } from 'react';
import type { AppError } from '../types';

export class AppErrorHandler {
  private static instance: AppErrorHandler;
  private errorLog: AppError[] = [];

  private constructor() {}

  public static getInstance(): AppErrorHandler {
    if (!AppErrorHandler.instance) {
      AppErrorHandler.instance = new AppErrorHandler();
    }
    return AppErrorHandler.instance;
  }

  public logError(error: AppError): void {
    this.errorLog.push({
      ...error,
      timestamp: new Date().toISOString()
    } as AppError & { timestamp: string });

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('App Error:', error);
    }

    // In production, you might want to send to an error tracking service
    // this.sendToErrorService(error);
  }

  public handleError(error: unknown, context?: string): AppError {
    let appError: AppError;

    if (error instanceof Error) {
      appError = {
        message: error.message,
        code: 'GENERIC_ERROR',
        details: { context, stack: error.stack }
      };
    } else if (typeof error === 'string') {
      appError = {
        message: error,
        code: 'STRING_ERROR',
        details: { context }
      };
    } else {
      appError = {
        message: 'An unknown error occurred',
        code: 'UNKNOWN_ERROR',
        details: { context, error }
      };
    }

    this.logError(appError);
    return appError;
  }

  public getErrorLog(): ReadonlyArray<AppError> {
    return [...this.errorLog];
  }

  public clearErrorLog(): void {
    this.errorLog = [];
  }

  // Specific error creators
  public createValidationError(message: string, field?: string): AppError {
    return {
      message,
      code: 'VALIDATION_ERROR',
      details: { field }
    };
  }

  public createNetworkError(message: string, status?: number): AppError {
    return {
      message,
      code: 'NETWORK_ERROR',
      details: { status }
    };
  }

  public createNotFoundError(resource: string, id?: string): AppError {
    return {
      message: `${resource} not found${id ? ` with id: ${id}` : ''}`,
      code: 'NOT_FOUND_ERROR',
      details: { resource, id }
    };
  }
}

// Singleton instance
export const errorHandler = AppErrorHandler.getInstance();

// Error boundary helper
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  const ErrorBoundaryWrapper: React.FC<P> = (props) => {
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState<AppError | null>(null);

    useEffect(() => {
      const handleError = (event: ErrorEvent) => {
        const appError = errorHandler.handleError(
          event.error || event.message,
          `Error at ${event.filename}:${event.lineno}`
        );
        setError(appError);
        setHasError(true);
      };

      window.addEventListener('error', handleError);
      return () => window.removeEventListener('error', handleError);
    }, []);

    if (hasError && error) {
      return React.createElement('div', {
        className: 'min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900'
      }, React.createElement('div', {
        className: 'max-w-md mx-auto p-6 bg-white dark:bg-red-800 rounded-lg shadow-lg'
      }, [
        React.createElement('h2', {
          key: 'title',
          className: 'text-xl font-bold text-red-600 dark:text-red-300 mb-4'
        }, 'Something went wrong'),
        React.createElement('p', {
          key: 'message',
          className: 'text-red-500 dark:text-red-200 mb-4'
        }, error.message),
        React.createElement('button', {
          key: 'retry',
          onClick: () => {
            setHasError(false);
            setError(null);
          },
          className: 'px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors mr-2'
        }, 'Try Again'),
        React.createElement('button', {
          key: 'reload',
          onClick: () => window.location.reload(),
          className: 'px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors'
        }, 'Reload Page')
      ]));
    }

    return React.createElement(Component, props);
  };

  ErrorBoundaryWrapper.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return ErrorBoundaryWrapper;
};

// Async error handler
export const handleAsync = async <T>(
  asyncFn: () => Promise<T>,
  context?: string
): Promise<{ data: T | null; error: AppError | null }> => {
  try {
    const data = await asyncFn();
    return { data, error: null };
  } catch (error) {
    const appError = errorHandler.handleError(error, context);
    return { data: null, error: appError };
  }
};

// React hook for error handling
export const useErrorHandler = () => {
  const [error, setError] = React.useState<AppError | null>(null);

  const handleError = React.useCallback((error: unknown, context?: string) => {
    const appError = errorHandler.handleError(error, context);
    setError(appError);
    return appError;
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};