
// Cryptographically secure ID generation with collision detection
export function generateSecureId(): string {
  const generateRandomId = (): string => {
    const array = new Uint8Array(12);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(36)).join('').substring(0, 15);
  };

  let id = generateRandomId();
  let attempts = 0;
  const maxAttempts = 5;
  
  // Simple collision detection (check against localStorage keys)
  while (attempts < maxAttempts) {
    const exists = Object.keys(localStorage).some(key => key.includes(id));
    if (!exists) {
      return id;
    }
    id = generateRandomId();
    attempts++;
  }
  
  // Fallback with timestamp if collision detection fails
  return generateRandomId() + Date.now().toString(36);
}

// Validate ID format
export function validateId(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  if (id.length < 10 || id.length > 50) return false;
  // Only allow alphanumeric characters and common safe symbols
  return /^[a-zA-Z0-9_-]+$/.test(id);
}
