
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
    /url\s*\(/gi
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

// Enhanced data structure validation
export const validateImportData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  
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

// Validate individual chain structure
const validateChainStructure = (chain: any): boolean => {
  if (!chain.id || !chain.name || !Array.isArray(chain.habits)) return false;
  if (chain.name.length > 100 || (chain.description && chain.description.length > 500)) return false;
  
  for (const habit of chain.habits) {
    if (!habit.id || !habit.name || habit.name.length > 100) return false;
    if (habit.description && habit.description.length > 200) return false;
  }
  
  return true;
};

// Validate stats structure
const validateStatsStructure = (stats: any): boolean => {
  const requiredStats = ['totalXp', 'level', 'streakDays', 'longestStreak', 'totalCompletions'];
  return requiredStats.every(field => typeof stats[field] === 'number' && stats[field] >= 0);
};

// Validate settings structure
const validateSettingsStructure = (settings: any): boolean => {
  return typeof settings.notificationsEnabled === 'boolean' &&
         typeof settings.darkMode === 'boolean' &&
         typeof settings.reminderTime === 'string';
};

// Enhanced rate limiting with memory cleanup
const actionCounts = new Map<string, { count: number; lastReset: number }>();

export const rateLimit = (action: string, maxActions: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  
  // Cleanup old entries periodically
  if (actionCounts.size > 100) {
    cleanupOldRateLimitEntries(now, windowMs);
  }
  
  const current = actionCounts.get(action);
  if (!current || now - current.lastReset > windowMs) {
    actionCounts.set(action, { count: 1, lastReset: now });
    return true;
  }
  
  if (current.count >= maxActions) {
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
