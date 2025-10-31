/**
 * Performance monitoring utilities for the AI Tools Directory
 * Tracks Core Web Vitals and custom performance metrics
 */

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  loadTime?: number;
  renderTime?: number;
  componentCount?: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initializeObservers();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers(): void {
    if (typeof window === 'undefined') return;

    // Observe Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();
  }

  private observeLCP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      this.logMetric('LCP', lastEntry.startTime);
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('LCP observer not supported');
    }
  }

  private observeFID(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
        this.logMetric('FID', this.metrics.fid);
      });
    });

    try {
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('FID observer not supported');
    }
  }

  private observeCLS(): void {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.metrics.cls = clsValue;
          this.logMetric('CLS', clsValue);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('CLS observer not supported');
    }
  }

  private observeFCP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.logMetric('FCP', entry.startTime);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('FCP observer not supported');
    }
  }

  private observeTTFB(): void {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      this.logMetric('TTFB', this.metrics.ttfb);
    }
  }

  public measureComponentRender(componentName: string, renderFn: () => void): void {
    const startTime = performance.now();
    renderFn();
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    this.logMetric(`${componentName} Render Time`, renderTime);
  }

  public measureAsyncOperation<T>(operationName: string, operation: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    
    return operation().then((result) => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.logMetric(`${operationName} Duration`, duration);
      return result;
    }).catch((error) => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.logMetric(`${operationName} Duration (Failed)`, duration);
      throw error;
    });
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public logMetric(name: string, value: number): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance: ${name} = ${value.toFixed(2)}ms`);
    }
  }

  public generateReport(): string {
    const metrics = this.getMetrics();
    const report = [
      '📊 Performance Report',
      '==================',
      `First Contentful Paint: ${metrics.fcp?.toFixed(2) || 'N/A'}ms`,
      `Largest Contentful Paint: ${metrics.lcp?.toFixed(2) || 'N/A'}ms`,
      `First Input Delay: ${metrics.fid?.toFixed(2) || 'N/A'}ms`,
      `Cumulative Layout Shift: ${metrics.cls?.toFixed(4) || 'N/A'}`,
      `Time to First Byte: ${metrics.ttfb?.toFixed(2) || 'N/A'}ms`,
      '',
      '🎯 Recommendations:',
      metrics.lcp && metrics.lcp > 2500 ? '• Optimize LCP (target: <2.5s)' : '✅ LCP is good',
      metrics.fid && metrics.fid > 100 ? '• Optimize FID (target: <100ms)' : '✅ FID is good',
      metrics.cls && metrics.cls > 0.1 ? '• Optimize CLS (target: <0.1)' : '✅ CLS is good',
    ].join('\n');

    return report;
  }

  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// React hook for performance monitoring
export function usePerformanceMonitor() {
  return {
    measureRender: (componentName: string, renderFn: () => void) => 
      performanceMonitor.measureComponentRender(componentName, renderFn),
    measureAsync: <T>(operationName: string, operation: () => Promise<T>) => 
      performanceMonitor.measureAsyncOperation(operationName, operation),
    getMetrics: () => performanceMonitor.getMetrics(),
    generateReport: () => performanceMonitor.generateReport(),
  };
}