
// Performance monitoring utilities
export class PerformanceMonitor {
  private static metrics = new Map<string, number>();
  
  // Start timing an operation
  static startTiming(operation: string): void {
    this.metrics.set(operation, performance.now());
  }
  
  // End timing and log result
  static endTiming(operation: string): number {
    const startTime = this.metrics.get(operation);
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    console.log(`⏱️ ${operation}: ${duration.toFixed(2)}ms`);
    this.metrics.delete(operation);
    
    return duration;
  }
  
  // Measure memory usage
  static getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }
  
  // Debounce function for performance
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
  
  // Throttle function for performance
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let lastRun = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun >= limit) {
        func(...args);
        lastRun = now;
      }
    };
  }
}

// Lazy loading utility
export const lazyLoad = <T>(importFunc: () => Promise<T>): Promise<T> => {
  return importFunc();
};

// Optimize large lists rendering
export const virtualizeList = (items: any[], visibleRange: { start: number; end: number }) => {
  return items.slice(visibleRange.start, visibleRange.end);
};
