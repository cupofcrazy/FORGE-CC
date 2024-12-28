interface StorageItem<T> {
  value: T;
  timestamp: number;
  expirationInMinutes: number | null;
}

export class StorageUtil {
  /**
   * Set an item in localStorage with optional expiration
   * @param key - The key to store the value under
   * @param value - The value to store
   * @param expirationInMinutes - Optional expiration time in minutes
   * @returns boolean indicating success
   */
  static setItem<T>(
    key: string,
    value: T,
    expirationInMinutes: number | null = null
  ): boolean {
    try {
      const item: StorageItem<T> = {
        value,
        timestamp: new Date().getTime(),
        expirationInMinutes
      };
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  /**
   * Get an item from localStorage
   * @param key - The key to retrieve
   * @param defaultValue - Value to return if key doesn't exist
   * @returns The stored value or defaultValue
   */
  static getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return defaultValue;

      const item: StorageItem<T> = JSON.parse(itemStr);
      
      // Check if item has expired
      if (item.expirationInMinutes) {
        const now = new Date().getTime();
        const expirationTime = item.timestamp + (item.expirationInMinutes * 60 * 1000);
        
        if (now > expirationTime) {
          this.removeItem(key);
          return defaultValue;
        }
      }

      return item.value;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Remove an item from localStorage
   * @param key - The key to remove
   * @returns boolean indicating success
   */
  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   * @returns boolean indicating success
   */
  static clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Get all keys stored in localStorage
   * @returns Array of keys
   */
  static getAllKeys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  }

  /**
   * Check if a key exists and is not expired
   * @param key - The key to check
   * @returns boolean indicating if item exists and is valid
   */
  static hasItem(key: string): boolean {
    return this.getItem(key, null) !== null;
  }

  /**
   * Get the remaining time in minutes before a key expires
   * @param key - The key to check
   * @returns Minutes remaining or null if no expiration
   */
  static getExpirationTime(key: string): number | null {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item: StorageItem<unknown> = JSON.parse(itemStr);
      if (!item.expirationInMinutes) return null;

      const now = new Date().getTime();
      const expirationTime = item.timestamp + (item.expirationInMinutes * 60 * 1000);
      const remainingTime = (expirationTime - now) / (60 * 1000);

      return remainingTime > 0 ? Math.round(remainingTime) : 0;
    } catch (error) {
      console.error('Error checking expiration time:', error);
      return null;
    }
  }

  /**
   * Get the total size of all items in localStorage in bytes
   * @returns Size in bytes
   */
  static getTotalSize(): number {
    try {
      let totalSize = 0;
      for (const key of this.getAllKeys()) {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += new Blob([item]).size;
        }
      }
      return totalSize;
    } catch (error) {
      console.error('Error calculating total size:', error);
      return 0;
    }
  }
}