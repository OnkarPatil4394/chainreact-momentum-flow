import { Habit, HabitChain, UserStats, Badge, AppSettings } from "../types/types";
import { sanitizeInput, validateInput, safeJsonParse, validateImportData, rateLimit } from "../utils/security";
import { secureStorage } from "../utils/secureStorage";
import { generateSecureId, validateId } from "../utils/secureId";

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
  reminderTime: "09:00"
};

// Database operations
class Database {
  // Store habit chains with secure storage
  saveChains(chains: HabitChain[]): void {
    secureStorage.setItem("chains", chains);
  }

  getChains(): HabitChain[] {
    const chains = secureStorage.getItem<HabitChain[]>("chains");
    return chains || [];
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

  // Create new chain with security validation
  addChain(chain: HabitChain): void {
    if (!rateLimit('addChain', 5, 60000)) {
      throw new Error('Rate limit exceeded for chain creation');
    }
    
    // Sanitize inputs
    const sanitizedChain = {
      ...chain,
      name: sanitizeInput(chain.name),
      description: sanitizeInput(chain.description || ''),
      habits: chain.habits.map(h => ({
        ...h,
        name: sanitizeInput(h.name),
        description: sanitizeInput(h.description || '')
      }))
    };
    
    // Validate inputs
    if (!validateInput(sanitizedChain.name, 100)) {
      throw new Error('Invalid chain name');
    }
    
    if (sanitizedChain.description && !validateInput(sanitizedChain.description, 500)) {
      throw new Error('Invalid chain description');
    }
    
    for (const habit of sanitizedChain.habits) {
      if (!validateInput(habit.name, 100)) {
        throw new Error('Invalid habit name');
      }
      if (habit.description && !validateInput(habit.description, 200)) {
        throw new Error('Invalid habit description');
      }
    }
    
    const chains = this.getChains();
    chains.push(sanitizedChain);
    this.saveChains(chains);
    this.checkBadges();
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

    const chains = this.getChains();
    const chain = chains.find((c) => c.id === chainId);
    
    if (!chain) return false;
    
    // Find the habit
    const habit = chain.habits.find((h) => h.id === habitId);
    if (!habit) return false;
    
    // Check if prerequisites are completed (all habits with lower positions)
    const prerequisites = chain.habits.filter(h => h.position < habit.position);
    const allPrerequisitesCompleted = prerequisites.every(h => h.completed);
    
    if (!allPrerequisitesCompleted) return false;
    
    // Mark habit as completed
    habit.completed = true;
    habit.completedAt = new Date().toISOString();
    
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

  // Enhanced secure export with integrity checksums
  exportData(): string {
    const data = {
      userName: sanitizeInput(this.getUserName()),
      chains: this.getChains(),
      stats: this.getStats(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString(),
      version: '2.0',
      integrity: true
    };
    
    const jsonData = JSON.stringify(data);
    const checksum = this.calculateDataChecksum(jsonData);
    
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

  // Enhanced secure import with integrity verification
  importData(jsonData: string): boolean {
    if (!rateLimit('importData', 3, 300000)) {
      throw new Error('Rate limit exceeded for data imports');
    }
    
    try {
      const importedData = safeJsonParse<{
        userName?: string;
        chains: any[];
        stats: any;
        settings: any;
        exportedAt: string;
        version: string;
        checksum?: string;
        integrity?: boolean;
      }>(jsonData);
      
      if (!importedData || !validateImportData(importedData)) {
        throw new Error('Invalid import data structure');
      }

      // Verify data integrity if checksum is present
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

      // Sanitize all text fields before saving
      const sanitizedChains = importedData.chains.map((chain: any) => ({
        ...chain,
        name: sanitizeInput(chain.name),
        description: sanitizeInput(chain.description || ''),
        habits: chain.habits.map((h: any) => ({
          ...h,
          name: sanitizeInput(h.name),
          description: sanitizeInput(h.description || '')
        }))
      }));
      
      this.saveChains(sanitizedChains);
      this.saveStats(importedData.stats);
      this.saveSettings(importedData.settings);
      
      // Import user name if available
      if (importedData.userName) {
        this.saveUserName(sanitizeInput(importedData.userName));
      }
      
      return true;
    } catch (e) {
      console.error("Failed to import data:", e);
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
