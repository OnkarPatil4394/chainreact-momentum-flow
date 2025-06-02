
import DOMPurify from 'dompurify';

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [] 
  }).trim();
};

// Validate input length and format
export const validateInput = (input: string, maxLength: number = 100): boolean => {
  if (!input || input.length > maxLength) return false;
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i
  ];
  return !suspiciousPatterns.some(pattern => pattern.test(input));
};

// Safe JSON parsing
export const safeJsonParse = <T>(jsonString: string): T | null => {
  try {
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (error) {
    console.error('JSON parsing failed:', error);
    return null;
  }
};

// Data structure validation for imports
export const validateImportData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  // Required fields
  if (!data.chains || !Array.isArray(data.chains)) return false;
  if (!data.stats || typeof data.stats !== 'object') return false;
  if (!data.settings || typeof data.settings !== 'object') return false;
  
  // Validate chains structure
  for (const chain of data.chains) {
    if (!chain.id || !chain.name || !Array.isArray(chain.habits)) return false;
    if (chain.name.length > 100 || chain.description?.length > 500) return false;
    
    for (const habit of chain.habits) {
      if (!habit.id || !habit.name || habit.name.length > 100) return false;
    }
  }
  
  return true;
};

// Rate limiting for actions
const actionCounts = new Map<string, { count: number; lastReset: number }>();

export const rateLimit = (action: string, maxActions: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const key = action;
  
  const current = actionCounts.get(key);
  if (!current || now - current.lastReset > windowMs) {
    actionCounts.set(key, { count: 1, lastReset: now });
    return true;
  }
  
  if (current.count >= maxActions) {
    return false;
  }
  
  current.count++;
  return true;
};
