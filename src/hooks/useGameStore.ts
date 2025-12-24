import { useState, useEffect } from 'react';
import { Quest, Habit, Goal, Achievement, UserProfile, Stats, calculateLevel } from '@/types/game';

const STORAGE_KEY = 'lifegame-os-data';

interface GameState {
  profile: UserProfile;
  quests: Quest[];
  habits: Habit[];
  goals: Goal[];
  achievements: Achievement[];
  stats: Stats;
}

const defaultState: GameState = {
  profile: {
    name: 'Player One',
    level: 1,
    currentXP: 0,
    totalXP: 0,
    title: 'Beginner Adventurer',
    joinedAt: new Date().toISOString(),
  },
  quests: [
    { id: '1', title: 'Morning Workout', description: 'Complete a 30-minute exercise session', xpReward: 50, category: 'health', completed: false },
    { id: '2', title: 'Read 20 Pages', description: 'Read at least 20 pages of a book', xpReward: 30, category: 'learning', completed: false },
    { id: '3', title: 'Clear Inbox', description: 'Process and organize all emails', xpReward: 40, category: 'productivity', completed: false },
    { id: '4', title: 'Connect with Friend', description: 'Have a meaningful conversation', xpReward: 35, category: 'social', completed: false },
  ],
  habits: [
    { id: '1', name: 'Drink Water', icon: '💧', streak: 5, completedToday: false, category: 'health' },
    { id: '2', name: 'Meditate', icon: '🧘', streak: 3, completedToday: false, category: 'health' },
    { id: '3', name: 'Journal', icon: '📝', streak: 7, completedToday: false, category: 'creative' },
    { id: '4', name: 'Code Practice', icon: '💻', streak: 12, completedToday: false, category: 'learning' },
  ],
  goals: [
    { id: '1', title: 'Run 100km', description: 'Complete 100km of running this month', progress: 45, target: 100, xpReward: 500, deadline: '2024-02-29', category: 'health' },
    { id: '2', title: 'Read 12 Books', description: 'Finish 12 books this year', progress: 3, target: 12, xpReward: 1000, deadline: '2024-12-31', category: 'learning' },
  ],
  achievements: [
    { id: '1', title: 'First Steps', description: 'Complete your first quest', icon: '🎯', unlocked: true, unlockedAt: new Date().toISOString(), rarity: 'common' },
    { id: '2', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', unlocked: false, rarity: 'rare' },
    { id: '3', title: 'Goal Crusher', description: 'Complete 5 goals', icon: '🏆', unlocked: false, rarity: 'epic' },
    { id: '4', title: 'Life Master', description: 'Reach level 50', icon: '👑', unlocked: false, rarity: 'legendary' },
  ],
  stats: {
    questsCompleted: 15,
    habitsTracked: 42,
    goalsAchieved: 2,
    totalXPEarned: 1250,
    currentStreak: 5,
    longestStreak: 14,
  },
};

export const useGameStore = () => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addXP = (amount: number) => {
    setState(prev => {
      const newTotalXP = prev.profile.totalXP + amount;
      const { level, currentXP } = calculateLevel(newTotalXP);
      return {
        ...prev,
        profile: {
          ...prev.profile,
          totalXP: newTotalXP,
          level,
          currentXP,
        },
        stats: {
          ...prev.stats,
          totalXPEarned: prev.stats.totalXPEarned + amount,
        },
      };
    });
  };

  const completeQuest = (questId: string) => {
    setState(prev => {
      const quest = prev.quests.find(q => q.id === questId);
      if (!quest || quest.completed) return prev;

      addXP(quest.xpReward);

      return {
        ...prev,
        quests: prev.quests.map(q => 
          q.id === questId ? { ...q, completed: true } : q
        ),
        stats: {
          ...prev.stats,
          questsCompleted: prev.stats.questsCompleted + 1,
        },
      };
    });
  };

  const completeHabit = (habitId: string) => {
    setState(prev => {
      const habit = prev.habits.find(h => h.id === habitId);
      if (!habit || habit.completedToday) return prev;

      addXP(20);

      return {
        ...prev,
        habits: prev.habits.map(h =>
          h.id === habitId ? { ...h, completedToday: true, streak: h.streak + 1 } : h
        ),
        stats: {
          ...prev.stats,
          habitsTracked: prev.stats.habitsTracked + 1,
        },
      };
    });
  };

  const addQuest = (quest: Omit<Quest, 'id' | 'completed'>) => {
    const newQuest: Quest = {
      ...quest,
      id: Date.now().toString(),
      completed: false,
    };
    setState(prev => ({
      ...prev,
      quests: [...prev.quests, newQuest],
    }));
  };

  const addHabit = (habit: Omit<Habit, 'id' | 'streak' | 'completedToday'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      streak: 0,
      completedToday: false,
    };
    setState(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'progress'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      progress: 0,
    };
    setState(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g =>
        g.id === goalId ? { ...g, progress: Math.min(progress, g.target) } : g
      ),
    }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
  };

  const deleteQuest = (questId: string) => {
    setState(prev => ({
      ...prev,
      quests: prev.quests.filter(q => q.id !== questId),
    }));
  };

  const deleteHabit = (habitId: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== habitId),
    }));
  };

  const deleteGoal = (goalId: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== goalId),
    }));
  };

  const updateQuestImage = (questId: string, image: string) => {
    setState(prev => ({
      ...prev,
      quests: prev.quests.map(q =>
        q.id === questId ? { ...q, image } : q
      ),
    }));
  };

  const updateHabitImage = (habitId: string, image: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h =>
        h.id === habitId ? { ...h, image } : h
      ),
    }));
  };

  const updateGoalImage = (goalId: string, image: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g =>
        g.id === goalId ? { ...g, image } : g
      ),
    }));
  };

  return {
    ...state,
    addXP,
    completeQuest,
    completeHabit,
    addQuest,
    addHabit,
    addGoal,
    updateGoalProgress,
    updateProfile,
    deleteQuest,
    deleteHabit,
    deleteGoal,
    updateQuestImage,
    updateHabitImage,
    updateGoalImage,
  };
};
