// Performance optimization utilities
class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private performanceMetrics: Map<string, number[]> = new Map();
  private memoryUsage: number[] = [];
  private isOptimizing = false;

  public static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Memory optimization
  public optimizeMemory(): void {
    if (this.isOptimizing) return;
    this.isOptimizing = true;

    try {
      // Clear unused event listeners
      this.clearUnusedEventListeners();
      
      // Clean up performance metrics
      this.cleanupMetrics();
      
      // Force garbage collection if available
      if ('gc' in window && typeof (window as any).gc === 'function') {
        (window as any).gc();
      }
      
      // Clear large objects from localStorage if needed
      this.optimizeLocalStorage();
      
      console.log('Memory optimization completed');
    } catch (error) {
      console.error('Memory optimization failed:', error);
    } finally {
      this.isOptimizing = false;
    }
  }

  // Monitor performance metrics
  public trackPerformance(operation: string, duration: number): void {
    if (!this.performanceMetrics.has(operation)) {
      this.performanceMetrics.set(operation, []);
    }
    
    const metrics = this.performanceMetrics.get(operation)!;
    metrics.push(duration);
    
    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }
    
    // Alert if performance degrades
    if (metrics.length > 10) {
      const average = metrics.reduce((a, b) => a + b, 0) / metrics.length;
      const recent = metrics.slice(-5).reduce((a, b) => a + b, 0) / 5;
      
      if (recent > average * 1.5) {
        console.warn(`Performance degradation detected in ${operation}`);
      }
    }
  }

  // Clean up old performance metrics
  private cleanupMetrics(): void {
    const maxAge = 5 * 60 * 1000; // 5 minutes
    const now = Date.now();
    
    for (const [key, metrics] of this.performanceMetrics.entries()) {
      if (metrics.length === 0) {
        this.performanceMetrics.delete(key);
      }
    }
  }

  // Clear unused event listeners
  private clearUnusedEventListeners(): void {
    // This is a placeholder - in a real app, you'd track listeners
    const unusedElements = document.querySelectorAll('[data-unused]');
    unusedElements.forEach(element => {
      element.remove();
    });
  }

  // Optimize localStorage usage
  private optimizeLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage);
      const totalSize = keys.reduce((size, key) => {
        return size + (localStorage.getItem(key)?.length || 0);
      }, 0);
      
      // If localStorage is getting large (>2MB), clean up
      if (totalSize > 2 * 1024 * 1024) {
        console.log('localStorage optimization needed');
        
        // Remove old or large temporary items
        keys.forEach(key => {
          if (key.startsWith('temp_') || key.startsWith('cache_')) {
            const item = localStorage.getItem(key);
            if (item && item.length > 50000) { // Remove items > 50KB
              localStorage.removeItem(key);
            }
          }
        });
      }
    } catch (error) {
      console.error('localStorage optimization failed:', error);
    }
  }

  // Monitor memory usage
  public monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usage = memory.usedJSHeapSize / memory.totalJSHeapSize;
      
      this.memoryUsage.push(usage);
      
      // Keep only last 50 measurements
      if (this.memoryUsage.length > 50) {
        this.memoryUsage.shift();
      }
      
      // Trigger optimization if memory usage is high
      if (usage > 0.8) {
        console.warn('High memory usage detected, optimizing...');
        setTimeout(() => this.optimizeMemory(), 1000);
      }
    }
  }

  // Debounce function for performance
  public debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate = false
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      
      const callNow = immediate && !timeout;
      
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      
      if (callNow) func(...args);
    };
  }

  // Throttle function for performance
  public throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return function executedFunction(...args: Parameters<T>) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Initialize performance monitoring
  public initialize(): void {
    // Monitor memory usage every 30 seconds
    setInterval(() => this.monitorMemoryUsage(), 30000);
    
    // Run memory optimization every 5 minutes
    setInterval(() => this.optimizeMemory(), 5 * 60 * 1000);
    
    // Monitor page visibility for optimization
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        setTimeout(() => this.optimizeMemory(), 5000);
      }
    });
  }
}

export const performanceOptimizer = PerformanceOptimizer.getInstance();
