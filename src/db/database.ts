import { Habit, HabitChain, UserStats, Badge, AppSettings } from "../types/types";
import { sanitizeInput, validateInput, safeJsonParse, validateImportData, rateLimit } from "../utils/security";
import { secureStorage } from "../utils/secureStorage";
import { generateSecureId, validateId } from "../utils/secureId";
import { PerformanceMonitor } from "../utils/performance";

// Initialize default data
const initialStats: UserStats = {
  totalXp: 0,
  level: 1,
  streakDays: 0,
  longestStreak: 0,
  totalCompletions: 0,
  badges: [
    {
      id: "badge-first-chain",
      name: "First Chain",
      description: "Create your first habit chain",
      iconName: "trophy",
      unlockedAt: null,
      unlocked: false
    },
    {
      id: "badge-3-day-streak",
      name: "3-Day Streak",
      description: "Complete a habit chain for 3 days in a row",
      iconName: "award",
      unlockedAt: null,
      unlocked: false
    },
    {
      id: "badge-7-day-streak",
      name: "Week Warrior",
      description: "Complete a habit chain for 7 days in a row",
      iconName: "star",
      unlockedAt: null,
      unlocked: false
    },
    {
      id: "badge-14-day-streak",
      name: "Fortnight Champion",
      description: "Complete a habit chain for 14 days in a row",
      iconName: "star",
      unlockedAt: null,
      unlocked: false
    },
    {
      id: "badge-30-day-streak",
      name: "Monthly Master",
      description: "Complete a habit chain for 30 days in a row",
      iconName: "star",
      unlockedAt: null,
      unlocked: false
    },
    {
      id: "badge-5-chains",
      name: "Chain Collector",
      description: "Create 5 different habit chains",
      iconName: "badge",
      unlockedAt: null,
      unlocked: false
    },
    {
      id: "badge-100-completions",
      name: "Century Club",
      description: "Complete 100 total habits",
      iconName: "badge-check",
      unlockedAt: null,
      unlocked: false
    }
  ]
};

const initialSettings: AppSettings = {
  notificationsEnabled: false,
  darkMode: false,
  reminderTime: "09:00",
  theme: "default",
  soundEnabled: true,
  soundVolume: 0.5
};

// Database operations with performance monitoring
class Database {
  // Store habit chains with secure storage and performance monitoring
  saveChains(chains: HabitChain[]): void {
    PerformanceMonitor.startTiming('saveChains');
    secureStorage.setItem("chains", chains);
    PerformanceMonitor.endTiming('saveChains');
  }

  getChains(): HabitChain[] {
    PerformanceMonitor.startTiming('getChains');
    const chains = secureStorage.getItem<HabitChain[]>("chains") || [];
    PerformanceMonitor.endTiming('getChains');
    return chains;
  }

  // Get a specific chain with ID validation
  getChain(chainId: string): HabitChain | null {
    if (!validateId(chainId)) {
      console.warn('Invalid chain ID format');
      return null;
    }
    const chains = this.getChains();
    const chain = chains.find((c) => c.id === chainId);
    return chain || null;
  }

  // Enhanced chain creation with stricter validation
  addChain(chain: HabitChain): void {
    if (!rateLimit('addChain', 3, 60000)) {
      throw new Error('Rate limit exceeded for chain creation');
    }
    
    PerformanceMonitor.startTiming('addChain');
    
    // Enhanced sanitization
    const sanitizedChain = this.sanitizeChainData(chain);
    
    // Enhanced validation
    this.validateChainData(sanitizedChain);
    
    const chains = this.getChains();
    
    // Check for duplicate names
    if (chains.some(c => c.name.toLowerCase() === sanitizedChain.name.toLowerCase())) {
      throw new Error('Chain name already exists');
    }
    
    chains.push(sanitizedChain);
    this.saveChains(chains);
    this.checkBadges();
    
    PerformanceMonitor.endTiming('addChain');
  }

  // Sanitize chain data
  private sanitizeChainData(chain: HabitChain): HabitChain {
    return {
      ...chain,
      name: sanitizeInput(chain.name, { maxLength: 100 }),
      description: sanitizeInput(chain.description || '', { maxLength: 500 }),
      habits: chain.habits.map(h => ({
        ...h,
        name: sanitizeInput(h.name, { maxLength: 100 }),
        description: sanitizeInput(h.description || '', { maxLength: 200 })
      }))
    };
  }

  // Validate chain data
  private validateChainData(chain: HabitChain): void {
    if (!validateInput(chain.name, 100)) {
      throw new Error('Invalid chain name');
    }
    
    if (chain.description && !validateInput(chain.description, 500)) {
      throw new Error('Invalid chain description');
    }
    
    if (chain.habits.length === 0) {
      throw new Error('Chain must have at least one habit');
    }
    
    if (chain.habits.length > 10) {
      throw new Error('Chain cannot have more than 10 habits');
    }
    
    for (const habit of chain.habits) {
      if (!validateInput(habit.name, 100)) {
        throw new Error(`Invalid habit name: ${habit.name}`);
      }
      if (habit.description && !validateInput(habit.description, 200)) {
        throw new Error(`Invalid habit description: ${habit.description}`);
      }
    }
  }

  // Update existing chain with security validation
  updateChain(updatedChain: HabitChain): void {
    if (!rateLimit('updateChain', 10, 60000)) {
      throw new Error('Rate limit exceeded for chain updates');
    }
    
    // Sanitize inputs
    const sanitizedChain = {
      ...updatedChain,
      name: sanitizeInput(updatedChain.name),
      description: sanitizeInput(updatedChain.description || ''),
      habits: updatedChain.habits.map(h => ({
        ...h,
        name: sanitizeInput(h.name),
        description: sanitizeInput(h.description || '')
      }))
    };
    
    const chains = this.getChains();
    const index = chains.findIndex((c) => c.id === sanitizedChain.id);
    if (index !== -1) {
      chains[index] = sanitizedChain;
      this.saveChains(chains);
    }
  }

  // Delete chain
  deleteChain(chainId: string): void {
    const chains = this.getChains();
    const filteredChains = chains.filter((c) => c.id !== chainId);
    this.saveChains(filteredChains);
  }

  // Mark habit as completed with enhanced validation
  completeHabit(chainId: string, habitId: string): boolean {
    if (!validateId(chainId) || !validateId(habitId)) {
      console.warn('Invalid ID format');
      return false;
    }

    PerformanceMonitor.startTiming('completeHabit');
    
    const chains = this.getChains();
    const chain = chains.find((c) => c.id === chainId);
    
    if (!chain) {
      PerformanceMonitor.endTiming('completeHabit');
      return false;
    }
    
    const targetHabit = chain.habits.find((h) => h.id === habitId);
    if (!targetHabit) {
      PerformanceMonitor.endTiming('completeHabit');
      return false;
    }
    
    // Check if already completed today
    if (targetHabit.completed) {
      PerformanceMonitor.endTiming('completeHabit');
      return false;
    }
    
    // Check if prerequisites are completed (all habits with lower positions)
    const prerequisites = chain.habits.filter(h => h.position < targetHabit.position);
    const allPrerequisitesCompleted = prerequisites.every(h => h.completed);
    
    if (!allPrerequisitesCompleted) return false;
    
    // Mark habit as completed
    targetHabit.completed = true;
    targetHabit.completedAt = new Date().toISOString();
    
    // Check if entire chain is completed
    const allCompleted = chain.habits.every(h => h.completed);
    if (allCompleted) {
      // Update streak and completion data
      const today = new Date().toLocaleDateString();
      const lastCompletedDate = chain.lastCompleted ? new Date(chain.lastCompleted).toLocaleDateString() : null;
      
      // If last completed was yesterday, increase streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toLocaleDateString();
      
      if (lastCompletedDate === yesterdayString) {
        chain.streak += 1;
      } else if (lastCompletedDate !== today) {
        // If not yesterday and not today already, reset streak to 1
        chain.streak = 1;
      }
      
      // Update longest streak if needed
      if (chain.streak > chain.longestStreak) {
        chain.longestStreak = chain.streak;
      }
      
      chain.totalCompletions += 1;
      chain.lastCompleted = new Date().toISOString();
      
      // Update global stats
      const stats = this.getStats();
      stats.totalCompletions += 1;
      stats.streakDays = Math.max(...chains.map(c => c.streak));
      stats.longestStreak = Math.max(stats.longestStreak, stats.streakDays);
      stats.totalXp += 10 * chain.habits.length; // 10 XP per habit
      this.saveStats(stats);
      
      // Reset all habits for tomorrow
      chain.habits.forEach(h => {
        h.completed = false;
        h.completedAt = null;
      });
    }
    
    this.updateChain(chain);
    this.checkBadges();
    
    PerformanceMonitor.endTiming('completeHabit');
    
    return true;
  }

  // Stats operations with secure storage
  getStats(): UserStats {
    const stats = secureStorage.getItem<UserStats>("stats");
    return stats || initialStats;
  }

  saveStats(stats: UserStats): void {
    secureStorage.setItem("stats", stats);
  }

  // Settings operations with secure storage
  getSettings(): AppSettings {
    const settings = secureStorage.getItem<AppSettings>("settings");
    return settings || initialSettings;
  }

  saveSettings(settings: AppSettings): void {
    secureStorage.setItem("settings", settings);
  }

  // Update settings method
  updateSettings(settings: AppSettings): void {
    this.saveSettings(settings);
  }

  // Clear all data method
  clearAllData(): void {
    secureStorage.clear();
  }

  // Check and update badges
  checkBadges(): void {
    const stats = this.getStats();
    const chains = this.getChains();
    
    // First chain badge
    if (chains.length > 0 && !stats.badges[0].unlocked) {
      stats.badges[0].unlocked = true;
      stats.badges[0].unlockedAt = new Date().toISOString();
      stats.totalXp += 50;
    }
    
    // 3-day streak badge
    if (stats.streakDays >= 3 && !stats.badges[1].unlocked) {
      stats.badges[1].unlocked = true;
      stats.badges[1].unlockedAt = new Date().toISOString();
      stats.totalXp += 100;
    }
    
    // 7-day streak badge
    if (stats.streakDays >= 7 && !stats.badges[2].unlocked) {
      stats.badges[2].unlocked = true;
      stats.badges[2].unlockedAt = new Date().toISOString();
      stats.totalXp += 200;
    }
    
    // 14-day streak badge
    if (stats.streakDays >= 14 && !stats.badges[3].unlocked) {
      stats.badges[3].unlocked = true;
      stats.badges[3].unlockedAt = new Date().toISOString();
      stats.totalXp += 300;
    }
    
    // 30-day streak badge
    if (stats.streakDays >= 30 && !stats.badges[4].unlocked) {
      stats.badges[4].unlocked = true;
      stats.badges[4].unlockedAt = new Date().toISOString();
      stats.totalXp += 500;
    }
    
    // 5 chains badge
    if (chains.length >= 5 && !stats.badges[5].unlocked) {
      stats.badges[5].unlocked = true;
      stats.badges[5].unlockedAt = new Date().toISOString();
      stats.totalXp += 250;
    }
    
    // 100 completions badge
    if (stats.totalCompletions >= 100 && !stats.badges[6].unlocked) {
      stats.badges[6].unlocked = true;
      stats.badges[6].unlockedAt = new Date().toISOString();
      stats.totalXp += 400;
    }
    
    // Calculate level based on XP (100 XP per level)
    stats.level = Math.floor(stats.totalXp / 100) + 1;
    
    this.saveStats(stats);
  }

  // Enhanced secure export with compression and integrity
  exportData(): string {
    PerformanceMonitor.startTiming('exportData');
    
    const data = {
      userName: sanitizeInput(this.getUserName()),
      chains: this.getChains(),
      stats: this.getStats(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString(),
      version: '2.1',
      integrity: true
    };
    
    const jsonData = JSON.stringify(data);
    
    // Add size validation
    if (jsonData.length > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('Export data too large');
    }
    
    const checksum = this.calculateDataChecksum(jsonData);
    
    PerformanceMonitor.endTiming('exportData');
    
    return JSON.stringify({
      ...data,
      checksum
    });
  }

  private calculateDataChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  // Enhanced secure import with better validation
  importData(jsonData: string): boolean {
    if (!rateLimit('importData', 2, 300000)) {
      throw new Error('Rate limit exceeded for data imports');
    }
    
    PerformanceMonitor.startTiming('importData');
    
    try {
      // Size check
      if (jsonData.length > 10 * 1024 * 1024) {
        throw new Error('Import data too large');
      }
      
      const importedData = safeJsonParse<{
        userName?: string;
        chains: any[];
        stats: any;
        settings: any;
        exportedAt: string;
        version: string;
        checksum?: string;
        integrity?: boolean;
      }>(jsonData, 10 * 1024 * 1024);
      
      if (!importedData || !validateImportData(importedData)) {
        throw new Error('Invalid import data structure');
      }

      // Enhanced integrity verification
      if (importedData.checksum && importedData.integrity) {
        const dataForChecksum = JSON.stringify({
          ...importedData,
          checksum: undefined
        });
        const calculatedChecksum = this.calculateDataChecksum(dataForChecksum);
        
        if (calculatedChecksum !== importedData.checksum) {
          throw new Error('Data integrity verification failed');
        }
      }

      // Enhanced sanitization
      const sanitizedChains = importedData.chains.map((chain: any) => 
        this.sanitizeChainData(chain)
      );
      
      // Validate all chains before saving
      sanitizedChains.forEach(chain => this.validateChainData(chain));
      
      this.saveChains(sanitizedChains);
      this.saveStats(importedData.stats);
      this.saveSettings(importedData.settings);
      
      if (importedData.userName) {
        this.saveUserName(sanitizeInput(importedData.userName));
      }
      
      PerformanceMonitor.endTiming('importData');
      return true;
    } catch (e) {
      console.error("Failed to import data:", e);
      PerformanceMonitor.endTiming('importData');
      return false;
    }
  }
  
  // Secure user name operations
  saveUserName(name: string): void {
    const sanitizedName = sanitizeInput(name);
    if (!validateInput(sanitizedName, 50)) {
      throw new Error('Invalid user name');
    }
    secureStorage.setItem("userName", sanitizedName);
  }
  
  getUserName(): string {
    return secureStorage.getItem<string>("userName") || "";
  }
  
  // Check if this is the first time opening the app
  isFirstTimeUser(): boolean {
    return !secureStorage.getItem("userName");
  }
}

export const db = new Database();

// Enhanced secure ID generation
export function generateId(): string {
  return generateSecureId();
}
