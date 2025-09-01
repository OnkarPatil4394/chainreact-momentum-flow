/**
 * Browser optimization utilities for cross-browser compatibility
 */

// Detect browser capabilities
export const browserSupport = {
  // Check for modern CSS features
  supportsViewportUnits: () => {
    try {
      const testElement = document.createElement('div');
      testElement.style.height = '100vh';
      return testElement.style.height === '100vh';
    } catch {
      return false;
    }
  },

  // Check for touch support
  supportsTouch: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // Check for PWA capabilities
  supportsPWA: () => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  },

  // Detect iOS Safari
  isIOSSafari: () => {
    const userAgent = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(userAgent) && /Safari/.test(userAgent) && !/CriOS|FxiOS|OPiOS|mercury/.test(userAgent);
  },

  // Detect mobile browsers
  isMobile: () => {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
};

// Optimize for different browsers
export const optimizeBrowser = () => {
  // Prevent overscroll on iOS Safari
  if (browserSupport.isIOSSafari()) {
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
  }

  // Fix viewport height on mobile browsers
  if (browserSupport.isMobile()) {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
  }

  // Disable zoom on mobile
  if (browserSupport.supportsTouch()) {
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    document.addEventListener('gestureend', (e) => e.preventDefault());
  }

  // Optimize scrolling performance
  const optimizeScrolling = () => {
    const scrollElements = document.querySelectorAll('.custom-scrollbar');
    scrollElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.transform = 'translateZ(0)';
      htmlElement.style.willChange = 'scroll-position';
    });
  };

  // Run optimizations after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeScrolling);
  } else {
    optimizeScrolling();
  }
};

// Performance monitoring
export const performanceMonitor = {
  measureRenderTime: (componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // More than one frame at 60fps
        console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
      }
    };
  },

  measureMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576),
        total: Math.round(memory.totalJSHeapSize / 1048576),
        limit: Math.round(memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  }
};

// Initialize browser optimizations
export const initializeBrowserOptimizations = () => {
  optimizeBrowser();
  
  // Log browser support information
  console.log('Browser capabilities:', {
    viewportUnits: browserSupport.supportsViewportUnits(),
    touch: browserSupport.supportsTouch(),
    pwa: browserSupport.supportsPWA(),
    isIOSSafari: browserSupport.isIOSSafari(),
    isMobile: browserSupport.isMobile()
  });
};