export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  category: 'health' | 'productivity' | 'social' | 'learning' | 'creative';
  completed: boolean;
  dueDate?: string;
  image?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  completedToday: boolean;
  category: 'health' | 'productivity' | 'social' | 'learning' | 'creative';
  image?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  xpReward: number;
  deadline: string;
  category: 'health' | 'productivity' | 'social' | 'learning' | 'creative';
  image?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserProfile {
  name: string;
  avatar?: string;
  level: number;
  currentXP: number;
  totalXP: number;
  title: string;
  joinedAt: string;
}

export interface Stats {
  questsCompleted: number;
  habitsTracked: number;
  goalsAchieved: number;
  totalXPEarned: number;
  currentStreak: number;
  longestStreak: number;
}

export type Category = 'health' | 'productivity' | 'social' | 'learning' | 'creative';

export const CATEGORY_COLORS: Record<Category, string> = {
  health: 'neon-green',
  productivity: 'neon-cyan',
  social: 'neon-magenta',
  learning: 'neon-purple',
  creative: 'neon-yellow',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  health: '💪',
  productivity: '⚡',
  social: '🤝',
  learning: '📚',
  creative: '🎨',
};

export const XP_PER_LEVEL = 1000;

// Sistem Gelar berdasarkan level
export const TITLES: Record<number, string> = {
  1: 'Petualang Pemula',
  10: 'Penjelajah Muda',
  20: 'Pahlawan Terlatih',
  30: 'Ksatria Berpengalaman',
  40: 'Sang Penakluk',
  50: 'Master Kehidupan',
  60: 'Legenda Hidup',
  70: 'Sang Bijaksana',
  80: 'Penjaga Waktu',
  90: 'Dewa Produktivitas',
  100: 'Raja Semesta',
};

export const getTitleForLevel = (level: number): string => {
  const thresholds = Object.keys(TITLES).map(Number).sort((a, b) => b - a);
  for (const threshold of thresholds) {
    if (level >= threshold) {
      return TITLES[threshold];
    }
  }
  return TITLES[1];
};

export const calculateLevel = (totalXP: number): { level: number; currentXP: number; xpForNextLevel: number } => {
  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;
  const currentXP = totalXP % XP_PER_LEVEL;
  const xpForNextLevel = XP_PER_LEVEL;
  return { level, currentXP, xpForNextLevel };
};
