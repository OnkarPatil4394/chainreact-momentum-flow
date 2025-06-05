
import { useEffect, useRef } from 'react';
import { PerformanceMonitor } from '../utils/performance';

// Hook for monitoring component performance
export const usePerformance = (componentName: string) => {
  const renderCount = useRef(0);
  const mountTime = useRef(0);
  
  useEffect(() => {
    mountTime.current = performance.now();
    PerformanceMonitor.startTiming(`${componentName}-mount`);
    
    return () => {
      PerformanceMonitor.endTiming(`${componentName}-mount`);
      console.log(`🔄 ${componentName} rendered ${renderCount.current} times`);
    };
  }, [componentName]);
  
  useEffect(() => {
    renderCount.current++;
  });
  
  return {
    renderCount: renderCount.current,
    getMountDuration: () => performance.now() - mountTime.current
  };
};

// Hook for debounced values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};
