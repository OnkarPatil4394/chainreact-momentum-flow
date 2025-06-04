
import { sanitizeInput, safeJsonParse } from './security';

// Secure localStorage wrapper with automatic sanitization and validation
class SecureStorage {
  private static instance: SecureStorage;
  
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

  // Secure storage with integrity check
  setItem(key: string, value: any): void {
    try {
      const sanitizedKey = sanitizeInput(key);
      const jsonValue = JSON.stringify(value);
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

      return safeJsonParse<T>(secureData.data);
    } catch (error) {
      console.error('Secure retrieval failed:', error);
      this.removeItem(key);
      return null;
    }
  }

  // Secure removal
  removeItem(key: string): void {
    const sanitizedKey = sanitizeInput(key);
    localStorage.removeItem(sanitizedKey);
  }

  // Clear all secure storage
  clear(): void {
    localStorage.clear();
  }
}

export const secureStorage = SecureStorage.getInstance();
