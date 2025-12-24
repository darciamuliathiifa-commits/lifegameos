import { Target, Flame, Zap, Trophy, TrendingUp, Calendar } from 'lucide-react';
import { Stats, Quest, Habit, Goal, UserProfile, XP_PER_LEVEL } from '@/types/game';
import { StatCard } from '@/components/shared/StatCard';
import { QuestCard } from '@/components/quests/QuestCard';
import { HabitCard } from '@/components/habits/HabitCard';
import { Progress } from '@/components/ui/progress';

interface DashboardProps {
  stats: Stats;
  quests: Quest[];
  habits: Habit[];
  goals: Goal[];
  profile: UserProfile;
  onCompleteQuest: (id: string) => void;
  onCompleteHabit: (id: string) => void;
}

export const Dashboard = ({ 
  stats, 
  quests, 
  habits, 
  goals, 
  profile,
  onCompleteQuest,
  onCompleteHabit 
}: DashboardProps) => {
  const activeQuests = quests.filter(q => !q.completed).slice(0, 3);
  const todayHabits = habits.slice(0, 4);
  const xpProgress = (profile.currentXP / XP_PER_LEVEL) * 100;

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Welcome Section */}
      <div className="card-gaming rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
        <div className="relative z-10">
          <h1 className="text-3xl lg:text-4xl font-display text-foreground mb-2">
            Welcome back, <span className="text-glow text-primary">{profile.name.split(' ')[0]}!</span>
          </h1>
          <p className="text-muted-foreground font-body text-lg mb-6">
            Ready to level up today? You're making great progress!
          </p>
          
          {/* Level Progress */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
                <span className="font-display text-2xl text-primary-foreground">{profile.level}</span>
              </div>
              <div>
                <p className="font-display text-lg text-foreground">Level {profile.level}</p>
                <p className="text-sm text-muted-foreground font-body">{profile.title}</p>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground font-body">Progress to Level {profile.level + 1}</span>
                <span className="text-primary font-display">{profile.currentXP} / {XP_PER_LEVEL} XP</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full xp-bar rounded-full transition-all duration-700 shadow-[0_0_15px_hsl(var(--primary)/0.6)]"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="Quests Completed"
          value={stats.questsCompleted}
          color="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={`${stats.currentStreak} days`}
          color="accent"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          icon={Zap}
          label="Total XP"
          value={stats.totalXPEarned.toLocaleString()}
          color="secondary"
        />
        <StatCard
          icon={Trophy}
          label="Goals Achieved"
          value={stats.goalsAchieved}
          color="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Quests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Active Quests
            </h2>
            <span className="text-sm text-muted-foreground font-body">
              {quests.filter(q => !q.completed).length} remaining
            </span>
          </div>
          <div className="space-y-3">
            {activeQuests.map((quest, index) => (
              <div key={quest.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-up">
                <QuestCard quest={quest} onComplete={onCompleteQuest} />
              </div>
            ))}
            {activeQuests.length === 0 && (
              <div className="card-gaming rounded-xl p-8 text-center">
                <p className="text-muted-foreground font-body">All quests completed! 🎉</p>
              </div>
            )}
          </div>
        </div>

        {/* Today's Habits */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-foreground flex items-center gap-2">
              <Flame className="w-5 h-5 text-accent" />
              Today's Habits
            </h2>
            <span className="text-sm text-muted-foreground font-body">
              {habits.filter(h => h.completedToday).length}/{habits.length}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {todayHabits.map((habit, index) => (
              <div key={habit.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-up">
                <HabitCard habit={habit} onComplete={onCompleteHabit} compact />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goals Overview */}
      <div className="space-y-4">
        <h2 className="font-display text-xl text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-success" />
          Goals Progress
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {goals.slice(0, 2).map((goal, index) => (
            <div 
              key={goal.id} 
              className="card-gaming rounded-xl p-5 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display text-lg text-foreground">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground font-body">{goal.description}</p>
                </div>
                <div className="flex items-center gap-1 text-accent">
                  <Zap className="w-4 h-4" />
                  <span className="font-display text-sm">+{goal.xpReward} XP</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-body">Progress</span>
                  <span className="text-primary font-display">{goal.progress}/{goal.target}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-500"
                    style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span className="font-body">Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
