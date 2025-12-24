import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { calculateLevel, XP_PER_LEVEL, getTitleForLevel } from '@/types/game';

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  title: string;
  avatar_url: string | null;
  level: number;
  current_xp: number;
  total_xp: number;
  created_at: string;
}

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  xp_reward: number;
  category: string;
  completed: boolean;
  image_url: string | null;
  difficulty?: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  category: string;
  streak: number;
  completed_today: boolean;
  image_url: string | null;
  repeat_frequency?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  target: number;
  progress: number;
  xp_reward: number;
  deadline: string | null;
  category: string;
  image_url: string | null;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  icon: string;
  rarity: string;
  unlocked: boolean;
  unlocked_at: string | null;
}

export interface UserStats {
  id: string;
  user_id: string;
  quests_completed: number;
  habits_tracked: number;
  goals_achieved: number;
  total_xp_earned: number;
  current_streak: number;
  longest_streak: number;
}

export const useSupabaseGameStore = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const [profileRes, questsRes, habitsRes, goalsRes, achievementsRes, statsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('quests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('habits').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('achievements').select('*').eq('user_id', user.id),
        supabase.from('user_stats').select('*').eq('user_id', user.id).maybeSingle(),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (questsRes.data) setQuests(questsRes.data);
      if (habitsRes.data) setHabits(habitsRes.data);
      if (goalsRes.data) setGoals(goalsRes.data);
      if (achievementsRes.data) setAchievements(achievementsRes.data);
      if (statsRes.data) setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add XP and update profile
  const addXP = async (amount: number) => {
    if (!user || !profile || !stats) return;

    const newTotalXP = profile.total_xp + amount;
    const { level, currentXP } = calculateLevel(newTotalXP);
    const newTitle = getTitleForLevel(level);
    const leveledUp = level > profile.level;

    const { error } = await supabase
      .from('profiles')
      .update({ total_xp: newTotalXP, level, current_xp: currentXP, title: newTitle })
      .eq('user_id', user.id);

    if (!error) {
      setProfile({ ...profile, total_xp: newTotalXP, level, current_xp: currentXP, title: newTitle });
      
      if (leveledUp) {
        toast.success(`🎉 Naik Level! Sekarang Level ${level}`, {
          description: `Gelar baru: ${newTitle}`
        });
      }
      
      await supabase
        .from('user_stats')
        .update({ total_xp_earned: stats.total_xp_earned + amount })
        .eq('user_id', user.id);
      
      setStats({ ...stats, total_xp_earned: stats.total_xp_earned + amount });
    }
  };

  // Quest operations
  const completeQuest = async (questId: string) => {
    if (!user || !stats) return;

    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    const { error } = await supabase
      .from('quests')
      .update({ completed: true })
      .eq('id', questId);

    if (!error) {
      setQuests(quests.map(q => q.id === questId ? { ...q, completed: true } : q));
      await addXP(quest.xp_reward);
      
      await supabase
        .from('user_stats')
        .update({ quests_completed: stats.quests_completed + 1 })
        .eq('user_id', user.id);
      
      setStats({ ...stats, quests_completed: stats.quests_completed + 1 });
      toast.success(`Misi selesai! +${quest.xp_reward} XP`);
    }
  };

  const addQuest = async (quest: { title: string; description?: string; xpReward: number; category: string; image?: string; difficulty?: string }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('quests')
      .insert({
        user_id: user.id,
        title: quest.title,
        description: quest.description || null,
        xp_reward: quest.xpReward,
        category: quest.category,
        image_url: quest.image || null,
        difficulty: quest.difficulty || 'medium',
      })
      .select()
      .single();

    if (!error && data) {
      setQuests([data, ...quests]);
      toast.success('Misi ditambahkan!');
    }
  };

  const updateQuest = async (questId: string, updates: { title?: string; description?: string; xpReward?: number; category?: string; difficulty?: string }) => {
    if (!user) return;

    const { error } = await supabase
      .from('quests')
      .update({
        title: updates.title,
        description: updates.description,
        xp_reward: updates.xpReward,
        category: updates.category,
        difficulty: updates.difficulty,
      })
      .eq('id', questId);

    if (!error) {
      setQuests(quests.map(q => q.id === questId ? { 
        ...q, 
        title: updates.title || q.title,
        description: updates.description || q.description,
        xp_reward: updates.xpReward || q.xp_reward,
        category: updates.category || q.category,
        difficulty: updates.difficulty || q.difficulty,
      } : q));
      toast.success('Misi diperbarui!');
    }
  };

  const deleteQuest = async (questId: string) => {
    const { error } = await supabase.from('quests').delete().eq('id', questId);
    if (!error) {
      setQuests(quests.filter(q => q.id !== questId));
      toast.success('Misi dihapus');
    }
  };

  const updateQuestImage = async (questId: string, imageUrl: string) => {
    const { error } = await supabase
      .from('quests')
      .update({ image_url: imageUrl })
      .eq('id', questId);

    if (!error) {
      setQuests(quests.map(q => q.id === questId ? { ...q, image_url: imageUrl } : q));
    }
  };

  // Habit operations
  const completeHabit = async (habitId: string) => {
    if (!user || !stats) return;

    const habit = habits.find(h => h.id === habitId);
    if (!habit || habit.completed_today) return;

    const { error } = await supabase
      .from('habits')
      .update({ 
        completed_today: true, 
        streak: habit.streak + 1,
        last_completed_at: new Date().toISOString().split('T')[0]
      })
      .eq('id', habitId);

    if (!error) {
      setHabits(habits.map(h => h.id === habitId ? { ...h, completed_today: true, streak: h.streak + 1 } : h));
      await addXP(20);
      
      const newStreak = stats.current_streak + 1;
      await supabase
        .from('user_stats')
        .update({ 
          habits_tracked: stats.habits_tracked + 1,
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, stats.longest_streak)
        })
        .eq('user_id', user.id);
      
      setStats({ 
        ...stats, 
        habits_tracked: stats.habits_tracked + 1,
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, stats.longest_streak)
      });
      toast.success('Kebiasaan selesai! +20 XP');
    }
  };

  const addHabit = async (habit: { name: string; icon: string; category: string; image?: string; repeatFrequency?: string }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('habits')
      .insert({
        user_id: user.id,
        name: habit.name,
        icon: habit.icon,
        category: habit.category,
        image_url: habit.image || null,
        repeat_frequency: habit.repeatFrequency || 'daily',
      })
      .select()
      .single();

    if (!error && data) {
      setHabits([data, ...habits]);
      toast.success('Kebiasaan ditambahkan!');
    }
  };

  const deleteHabit = async (habitId: string) => {
    const { error } = await supabase.from('habits').delete().eq('id', habitId);
    if (!error) {
      setHabits(habits.filter(h => h.id !== habitId));
      toast.success('Kebiasaan dihapus');
    }
  };

  const updateHabitImage = async (habitId: string, imageUrl: string) => {
    const { error } = await supabase
      .from('habits')
      .update({ image_url: imageUrl })
      .eq('id', habitId);

    if (!error) {
      setHabits(habits.map(h => h.id === habitId ? { ...h, image_url: imageUrl } : h));
    }
  };

  // Goal operations
  const addGoal = async (goal: { title: string; description?: string; target: number; xpReward: number; deadline?: string; category: string; image?: string }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        title: goal.title,
        description: goal.description || null,
        target: goal.target,
        xp_reward: goal.xpReward,
        deadline: goal.deadline || null,
        category: goal.category,
        image_url: goal.image || null,
      })
      .select()
      .single();

    if (!error && data) {
      setGoals([data, ...goals]);
      toast.success('Goal added!');
    }
  };

  const updateGoalProgress = async (goalId: string, progress: number) => {
    if (!user || !stats) return;

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const newProgress = Math.min(progress, goal.target);
    const { error } = await supabase
      .from('goals')
      .update({ progress: newProgress })
      .eq('id', goalId);

    if (!error) {
      setGoals(goals.map(g => g.id === goalId ? { ...g, progress: newProgress } : g));
      
      // Check if goal is completed
      if (newProgress >= goal.target && goal.progress < goal.target) {
        await addXP(goal.xp_reward);
        await supabase
          .from('user_stats')
          .update({ goals_achieved: stats.goals_achieved + 1 })
          .eq('user_id', user.id);
        setStats({ ...stats, goals_achieved: stats.goals_achieved + 1 });
        toast.success(`Goal achieved! +${goal.xp_reward} XP`);
      }
    }
  };

  const deleteGoal = async (goalId: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', goalId);
    if (!error) {
      setGoals(goals.filter(g => g.id !== goalId));
      toast.success('Goal deleted');
    }
  };

  const updateGoalImage = async (goalId: string, imageUrl: string) => {
    const { error } = await supabase
      .from('goals')
      .update({ image_url: imageUrl })
      .eq('id', goalId);

    if (!error) {
      setGoals(goals.map(g => g.id === goalId ? { ...g, image_url: imageUrl } : g));
    }
  };

  // Profile operations
  const updateProfile = async (updates: Partial<{ name: string; title: string; avatar_url: string }>) => {
    if (!user || !profile) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (!error) {
      setProfile({ ...profile, ...updates });
      toast.success('Profile updated!');
    }
  };

  // Upload image to storage
  const uploadImage = async (file: File, bucket: 'avatars' | 'images'): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { upsert: true });

    if (error) {
      toast.error('Failed to upload image');
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  // Transform data for compatibility with existing components
  const transformedProfile = profile ? {
    name: profile.name,
    level: profile.level,
    currentXP: profile.current_xp,
    totalXP: profile.total_xp,
    title: profile.title,
    joinedAt: profile.created_at,
    avatar: profile.avatar_url || undefined,
  } : {
    name: 'Player One',
    level: 1,
    currentXP: 0,
    totalXP: 0,
    title: 'Beginner Adventurer',
    joinedAt: new Date().toISOString(),
  };

  const transformedQuests = quests.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description || '',
    xpReward: q.xp_reward,
    category: q.category as 'health' | 'learning' | 'productivity' | 'social' | 'creative',
    completed: q.completed,
    image: q.image_url || undefined,
  }));

  const transformedHabits = habits.map(h => ({
    id: h.id,
    name: h.name,
    icon: h.icon,
    streak: h.streak,
    completedToday: h.completed_today,
    category: h.category as 'health' | 'learning' | 'productivity' | 'social' | 'creative',
    image: h.image_url || undefined,
    repeatFrequency: (h.repeat_frequency || 'daily') as 'daily' | 'weekly' | 'monthly',
  }));

  const transformedGoals = goals.map(g => ({
    id: g.id,
    title: g.title,
    description: g.description || '',
    progress: g.progress,
    target: g.target,
    xpReward: g.xp_reward,
    deadline: g.deadline || '',
    category: g.category as 'health' | 'learning' | 'productivity' | 'social' | 'creative',
    image: g.image_url || undefined,
  }));

  const transformedAchievements = achievements.map(a => ({
    id: a.id,
    title: a.title,
    description: a.description || '',
    icon: a.icon,
    unlocked: a.unlocked,
    unlockedAt: a.unlocked_at || undefined,
    rarity: a.rarity as 'common' | 'rare' | 'epic' | 'legendary',
  }));

  const transformedStats = stats ? {
    questsCompleted: stats.quests_completed,
    habitsTracked: stats.habits_tracked,
    goalsAchieved: stats.goals_achieved,
    totalXPEarned: stats.total_xp_earned,
    currentStreak: stats.current_streak,
    longestStreak: stats.longest_streak,
  } : {
    questsCompleted: 0,
    habitsTracked: 0,
    goalsAchieved: 0,
    totalXPEarned: 0,
    currentStreak: 0,
    longestStreak: 0,
  };

  return {
    loading,
    profile: transformedProfile,
    quests: transformedQuests,
    habits: transformedHabits,
    goals: transformedGoals,
    achievements: transformedAchievements,
    stats: transformedStats,
    completeQuest,
    addQuest,
    updateQuest,
    deleteQuest,
    updateQuestImage,
    completeHabit,
    addHabit,
    deleteHabit,
    updateHabitImage,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    updateGoalImage,
    updateProfile: (updates: Partial<{ name: string; title: string; avatar?: string }>) => {
      return updateProfile({
        name: updates.name,
        title: updates.title,
        avatar_url: updates.avatar,
      });
    },
    uploadImage,
  };
};
