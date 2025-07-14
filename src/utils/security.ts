
import DOMPurify from 'dompurify';

// Enhanced input sanitization with configurable options
export const sanitizeInput = (input: string, options?: {
  allowedTags?: string[];
  allowedAttributes?: string[];
  maxLength?: number;
}): string => {
  const config = {
    ALLOWED_TAGS: options?.allowedTags || [],
    ALLOWED_ATTR: options?.allowedAttributes || [],
    MAX_LENGTH: options?.maxLength || 1000
  };
  
  if (input.length > config.MAX_LENGTH) {
    input = input.substring(0, config.MAX_LENGTH);
  }
  
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: config.ALLOWED_TAGS,
    ALLOWED_ATTR: config.ALLOWED_ATTR,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false
  }).trim();
};

// Enhanced validation with XSS protection
export const validateInput = (input: string, maxLength: number = 100): boolean => {
  if (!input || typeof input !== 'string' || input.length > maxLength) {
    return false;
  }
  
  // Enhanced suspicious patterns detection
  const suspiciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript\s*:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /vbscript\s*:/gi,
    /<iframe[^>]*>/gi,
    /<embed[^>]*>/gi,
    /<object[^>]*>/gi,
    /expression\s*\(/gi,
    /url\s*\(/gi,
    /eval\s*\(/gi,
    /Function\s*\(/gi,
    /setTimeout\s*\(/gi,
    /setInterval\s*\(/gi
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(input));
};

// Safe JSON parsing with size limits
export const safeJsonParse = <T>(jsonString: string, maxSize: number = 1024 * 1024): T | null => {
  try {
    if (jsonString.length > maxSize) {
      console.error('JSON data too large');
      return null;
    }
    
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (error) {
    console.error('JSON parsing failed:', error);
    return null;
  }
};

// Enhanced data structure validation with tamper detection
export const validateImportData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  // Check for tampering attempts
  if (detectTamperingAttempts(data)) {
    console.warn('Potential tampering detected in import data');
    return false;
  }
  
  // Check required structure
  const requiredFields = ['chains', 'stats', 'settings'];
  if (!requiredFields.every(field => field in data)) return false;
  
  // Validate chains
  if (!Array.isArray(data.chains)) return false;
  
  for (const chain of data.chains) {
    if (!validateChainStructure(chain)) return false;
  }
  
  // Validate stats structure
  if (!validateStatsStructure(data.stats)) return false;
  
  // Validate settings structure
  if (!validateSettingsStructure(data.settings)) return false;
  
  return true;
};

// Detect potential tampering attempts
const detectTamperingAttempts = (data: any): boolean => {
  const dangerousKeys = ['__proto__', 'constructor', 'prototype', 'eval', 'Function'];
  
  const checkObject = (obj: any, depth = 0): boolean => {
    if (depth > 10) return true; // Prevent deep recursion attacks
    
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (dangerousKeys.includes(key)) return true;
        if (typeof key === 'string' && validateInput(key, 50) === false) return true;
        if (checkObject(obj[key], depth + 1)) return true;
      }
    }
    return false;
  };
  
  return checkObject(data);
};

// Validate individual chain structure
const validateChainStructure = (chain: any): boolean => {
  if (!chain.id || !chain.name || !Array.isArray(chain.habits)) return false;
  if (chain.name.length > 100 || (chain.description && chain.description.length > 500)) return false;
  
  // Sanitize chain data
  chain.name = sanitizeInput(chain.name, { maxLength: 100 });
  if (chain.description) {
    chain.description = sanitizeInput(chain.description, { maxLength: 500 });
  }
  
  for (const habit of chain.habits) {
    if (!habit.id || !habit.name || habit.name.length > 100) return false;
    if (habit.description && habit.description.length > 200) return false;
    
    // Sanitize habit data
    habit.name = sanitizeInput(habit.name, { maxLength: 100 });
    if (habit.description) {
      habit.description = sanitizeInput(habit.description, { maxLength: 200 });
    }
  }
  
  return true;
};

// Validate stats structure
const validateStatsStructure = (stats: any): boolean => {
  const requiredStats = ['totalXp', 'level', 'streakDays', 'longestStreak', 'totalCompletions'];
  return requiredStats.every(field => {
    const value = stats[field];
    return typeof value === 'number' && value >= 0 && value < Number.MAX_SAFE_INTEGER;
  });
};

// Validate settings structure
const validateSettingsStructure = (settings: any): boolean => {
  return typeof settings.notificationsEnabled === 'boolean' &&
         typeof settings.darkMode === 'boolean' &&
         typeof settings.reminderTime === 'string' &&
         settings.reminderTime.length < 10;
};

// Enhanced rate limiting with memory cleanup and attack detection
const actionCounts = new Map<string, { count: number; lastReset: number; suspicious: boolean }>();

export const rateLimit = (action: string, maxActions: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  
  // Cleanup old entries periodically
  if (actionCounts.size > 100) {
    cleanupOldRateLimitEntries(now, windowMs);
  }
  
  const current = actionCounts.get(action);
  if (!current || now - current.lastReset > windowMs) {
    actionCounts.set(action, { count: 1, lastReset: now, suspicious: false });
    return true;
  }
  
  if (current.count >= maxActions) {
    // Mark as suspicious if excessive requests
    if (current.count > maxActions * 2) {
      current.suspicious = true;
      console.warn(`Suspicious activity detected for action: ${action}`);
    }
    return false;
  }
  
  current.count++;
  return true;
};

// Cleanup old rate limit entries
const cleanupOldRateLimitEntries = (now: number, windowMs: number): void => {
  for (const [key, value] of actionCounts.entries()) {
    if (now - value.lastReset > windowMs * 2) {
      actionCounts.delete(key);
    }
  }
};

// Content Security Policy validation
export const validateCSP = (): boolean => {
  const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  return meta !== null;
};

// Check for secure context
export const isSecureContext = (): boolean => {
  return window.isSecureContext || window.location.protocol === 'https:';
};

// Anti-tampering protection
export const protectFromTampering = (): void => {
  // Protect console
  if (typeof console !== 'undefined') {
    const originalConsole = { ...console };
    
    // Monitor suspicious console usage
    ['log', 'warn', 'error'].forEach(method => {
      const original = originalConsole[method as keyof typeof originalConsole];
      if (typeof original === 'function') {
        (console as any)[method] = function(...args: any[]) {
          // Allow normal logging but detect malicious patterns
          const message = args.join(' ');
          if (typeof message === 'string' && validateInput(message, 1000)) {
            original.apply(console, args);
          }
        };
      }
    });
  }
  
  // Protect against debugging
  const detectDevTools = () => {
    const start = performance.now();
    debugger;
    const end = performance.now();
    if (end - start > 100) {
      console.warn('Developer tools detected');
    }
  };
  
  // Run detection periodically but not too frequently to avoid performance impact
  setInterval(detectDevTools, 30000);
};

// Initialize protection on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', protectFromTampering);
}
