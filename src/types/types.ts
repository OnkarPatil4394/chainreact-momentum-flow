
export type Habit = {
  id: string;
  name: string;
  description: string;
  position: number; // Position in chain
  chainId: string;
  completed: boolean;
  completedAt: string | null; // ISO string date when completed
  icon?: string; // Optional icon name
};

export type HabitChain = {
  id: string;
  name: string;
  description: string;
  habits: Habit[];
  createdAt: string; // ISO string date
  lastCompleted: string | null; // ISO string date
  streak: number;
  longestStreak: number;
  totalCompletions: number;
};

export type UserStats = {
  totalXp: number;
  level: number;
  streakDays: number;
  longestStreak: number;
  totalCompletions: number;
  badges: Badge[];
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlockedAt: string | null; // ISO string date when unlocked
  unlocked: boolean;
};

export type AppSettings = {
  notificationsEnabled: boolean;
  darkMode: boolean;
  reminderTime: string; // 24 hour format: "HH:MM"
};
