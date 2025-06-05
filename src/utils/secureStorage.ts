
import { sanitizeInput, safeJsonParse } from './security';

// Secure localStorage wrapper with automatic sanitization and validation
class SecureStorage {
  private static instance: SecureStorage;
  private readonly maxDataSize = 5 * 1024 * 1024; // 5MB limit
  private readonly maxKeyLength = 100;
  
  public static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  // Generate cryptographically secure random values
  private generateSecureNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Validate data integrity with simple checksum
  private calculateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Validate key format
  private validateKey(key: string): boolean {
    if (!key || key.length > this.maxKeyLength) return false;
    // Only allow alphanumeric characters, hyphens, and underscores
    return /^[a-zA-Z0-9_-]+$/.test(key);
  }

  // Secure storage with integrity check
  setItem(key: string, value: any): void {
    try {
      if (!this.validateKey(key)) {
        throw new Error('Invalid storage key format');
      }

      const sanitizedKey = sanitizeInput(key);
      const jsonValue = JSON.stringify(value);
      
      if (jsonValue.length > this.maxDataSize) {
        throw new Error('Data too large for secure storage');
      }

      const checksum = this.calculateChecksum(jsonValue);
      const secureData = {
        data: jsonValue,
        checksum,
        timestamp: Date.now(),
        nonce: this.generateSecureNonce()
      };
      
      localStorage.setItem(sanitizedKey, JSON.stringify(secureData));
    } catch (error) {
      console.error('Secure storage failed:', error);
      throw new Error('Failed to store data securely');
    }
  }

  // Secure retrieval with integrity verification
  getItem<T>(key: string): T | null {
    try {
      if (!this.validateKey(key)) {
        console.warn('Invalid storage key format');
        return null;
      }

      const sanitizedKey = sanitizeInput(key);
      const storedData = localStorage.getItem(sanitizedKey);
      
      if (!storedData) return null;

      const secureData = safeJsonParse<{
        data: string;
        checksum: string;
        timestamp: number;
        nonce: string;
      }>(storedData);

      if (!secureData) {
        console.warn('Invalid stored data format, removing corrupted entry');
        this.removeItem(key);
        return null;
      }

      // Verify data integrity
      const calculatedChecksum = this.calculateChecksum(secureData.data);
      if (calculatedChecksum !== secureData.checksum) {
        console.warn('Data integrity check failed, removing corrupted entry');
        this.removeItem(key);
        return null;
      }

      // Check data age (optional: remove data older than 1 year)
      const oneYear = 365 * 24 * 60 * 60 * 1000;
      if (Date.now() - secureData.timestamp > oneYear) {
        console.info('Removing expired data');
        this.removeItem(key);
        return null;
      }

      return safeJsonParse<T>(secureData.data);
    } catch (error) {
      console.error('Secure retrieval failed:', error);
      this.removeItem(key);
      return null;
    }
  }

  // Secure removal
  removeItem(key: string): void {
    if (!this.validateKey(key)) {
      console.warn('Invalid storage key format');
      return;
    }
    const sanitizedKey = sanitizeInput(key);
    localStorage.removeItem(sanitizedKey);
  }

  // Enhanced secure clear with confirmation
  clear(): void {
    try {
      localStorage.clear();
      console.info('Secure storage cleared successfully');
    } catch (error) {
      console.error('Failed to clear secure storage:', error);
      throw new Error('Failed to clear storage securely');
    }
  }

  // Get storage statistics
  getStorageInfo(): { used: number; available: number; itemCount: number } {
    let used = 0;
    let itemCount = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const item = localStorage.getItem(key);
        if (item) {
          used += item.length + key.length;
          itemCount++;
        }
      }
    }
    
    // Estimate available space (most browsers have ~5-10MB limit)
    const estimated = 10 * 1024 * 1024; // 10MB estimate
    const available = Math.max(0, estimated - used);
    
    return { used, available, itemCount };
  }
}

export const secureStorage = SecureStorage.getInstance();
