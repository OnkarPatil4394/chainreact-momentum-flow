
import { Habit, HabitChain, UserStats, Badge, AppSettings } from "../types/types";

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
  // Store habit chains
  saveChains(chains: HabitChain[]): void {
    localStorage.setItem("chains", JSON.stringify(chains));
  }

  getChains(): HabitChain[] {
    const chains = localStorage.getItem("chains");
    return chains ? JSON.parse(chains) : [];
  }

  // Get a specific chain
  getChain(chainId: string): HabitChain | null {
    const chains = this.getChains();
    const chain = chains.find((c) => c.id === chainId);
    return chain || null;
  }

  // Create new chain
  addChain(chain: HabitChain): void {
    const chains = this.getChains();
    chains.push(chain);
    this.saveChains(chains);
    this.checkBadges();
  }

  // Update existing chain
  updateChain(updatedChain: HabitChain): void {
    const chains = this.getChains();
    const index = chains.findIndex((c) => c.id === updatedChain.id);
    if (index !== -1) {
      chains[index] = updatedChain;
      this.saveChains(chains);
    }
  }

  // Delete chain
  deleteChain(chainId: string): void {
    const chains = this.getChains();
    const filteredChains = chains.filter((c) => c.id !== chainId);
    this.saveChains(filteredChains);
  }

  // Mark habit as completed
  completeHabit(chainId: string, habitId: string): boolean {
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

  // Stats operations
  getStats(): UserStats {
    const stats = localStorage.getItem("stats");
    return stats ? JSON.parse(stats) : initialStats;
  }

  saveStats(stats: UserStats): void {
    localStorage.setItem("stats", JSON.stringify(stats));
  }

  // Settings operations
  getSettings(): AppSettings {
    const settings = localStorage.getItem("settings");
    return settings ? JSON.parse(settings) : initialSettings;
  }

  saveSettings(settings: AppSettings): void {
    localStorage.setItem("settings", JSON.stringify(settings));
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

  // Export data
  exportData(): string {
    const data = {
      chains: this.getChains(),
      stats: this.getStats(),
      settings: this.getSettings(),
    };
    return JSON.stringify(data);
  }

  // Import data
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.chains && data.stats && data.settings) {
        this.saveChains(data.chains);
        this.saveStats(data.stats);
        this.saveSettings(data.settings);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to import data:", e);
      return false;
    }
  }
}

export const db = new Database();

// Helper to generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
