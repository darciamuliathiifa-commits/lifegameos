import { useState, useEffect } from 'react';
import { Plus, Clock, TrendingUp } from 'lucide-react';
import { Quest, Habit, Goal, Stats, UserProfile } from '@/types/game';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { MusicPlayer } from '@/components/music/MusicPlayer';
import { PrayerTimesWidget } from '@/components/prayers/PrayerTimesWidget';
import { CalendarWithNotes } from '@/components/calendar/CalendarWithNotes';
import { 
  IconCalendar, IconHabits, IconJournal, IconMeal, IconTravel, IconWorkout,
  IconBook, IconMovie, IconWallet, IconTarget, IconVision, IconHeart,
  IconPlanner, IconCheck, IconSun, IconMoon
} from '@/components/icons/CleanIcons';

interface LifePlannerDashboardProps {
  stats: Stats;
  quests: Quest[];
  habits: Habit[];
  goals: Goal[];
  profile: UserProfile;
  onCompleteQuest: (id: string) => void;
  onCompleteHabit: (id: string) => void;
  onNavigate: (tab: string) => void;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: 'Good Morning', Icon: IconSun };
  if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', Icon: IconSun };
  if (hour >= 17 && hour < 21) return { text: 'Good Evening', Icon: IconMoon };
  return { text: 'Good Night', Icon: IconMoon };
};

const categoryCards = [
  { 
    id: 'daily', 
    title: 'Daily', 
    Icon: IconCalendar,
    items: [
      { name: 'Planner', Icon: IconPlanner },
      { name: 'Habits', Icon: IconHabits },
      { name: 'Journal', Icon: IconJournal }
    ],
    tab: 'quests',
    color: 'text-primary'
  },
  { 
    id: 'planners', 
    title: 'Planners', 
    Icon: IconMeal,
    items: [
      { name: 'Meal Planner', Icon: IconMeal },
      { name: 'Travel Planner', Icon: IconTravel },
      { name: 'Workout Planner', Icon: IconWorkout }
    ],
    tab: 'habits',
    color: 'text-secondary'
  },
  { 
    id: 'personal', 
    title: 'Personal', 
    Icon: IconBook,
    items: [
      { name: 'Bookshelf', Icon: IconBook },
      { name: 'Movies & Series', Icon: IconMovie },
      { name: 'Finance', Icon: IconWallet }
    ],
    tab: 'goals',
    color: 'text-accent'
  },
  { 
    id: 'goals', 
    title: 'Goals', 
    Icon: IconTarget,
    items: [
      { name: 'Goals', Icon: IconTarget },
      { name: 'Vision', Icon: IconVision },
      { name: 'Health', Icon: IconHeart }
    ],
    tab: 'goals',
    color: 'text-success'
  },
];

const overviewTabs = [
  { name: 'Todo', Icon: IconCheck },
  { name: 'Journal', Icon: IconJournal },
  { name: 'Habits', Icon: IconHabits },
  { name: 'Workout', Icon: IconWorkout },
  { name: 'Meal', Icon: IconMeal },
];

export const LifePlannerDashboard = ({
  stats,
  quests,
  habits,
  goals,
  profile,
  onCompleteQuest,
  onCompleteHabit,
  onNavigate,
}: LifePlannerDashboardProps) => {
  const [activeOverviewTab, setActiveOverviewTab] = useState('Todo');
  const [greeting] = useState(getGreeting());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeQuests = quests.filter(q => !q.completed);
  const upcomingTasks = [...quests.filter(q => !q.completed)].slice(0, 6);

  const getCategoryStyle = (category: string) => {
    switch(category) {
      case 'health': return { bg: 'bg-destructive/10', text: 'text-destructive', dot: 'bg-destructive' };
      case 'productivity': return { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' };
      case 'learning': return { bg: 'bg-secondary/10', text: 'text-secondary', dot: 'bg-secondary' };
      case 'social': return { bg: 'bg-accent/10', text: 'text-accent', dot: 'bg-accent' };
      case 'creative': return { bg: 'bg-accent/10', text: 'text-accent', dot: 'bg-accent' };
      default: return { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground' };
    }
  };

  const getPriorityBadge = (xp: number) => {
    if (xp >= 100) return <span className="px-2 py-0.5 rounded text-xs bg-destructive/15 text-destructive font-medium">High</span>;
    if (xp >= 50) return <span className="px-2 py-0.5 rounded text-xs bg-secondary/15 text-secondary font-medium">Mid</span>;
    return null;
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Clock className="w-4 h-4" />
            <span>Last update: {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-foreground">
            {greeting.text},{' '}
            <span className="text-primary">{profile.name.split(' ')[0]}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-medium">+{stats.questsCompleted} tasks</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Quests', value: stats.questsCompleted, trend: '+12%', Icon: IconTarget, color: 'primary' },
          { label: 'Habits', value: stats.habitsTracked, trend: '+8%', Icon: IconHabits, color: 'success' },
          { label: 'Current Streak', value: `${stats.currentStreak}d`, trend: '+5%', Icon: IconCalendar, color: 'secondary' },
          { label: 'Goals', value: stats.goalsAchieved, trend: '+3%', Icon: IconVision, color: 'accent' },
        ].map((stat, index) => (
          <div 
            key={stat.label}
            className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                stat.color === 'primary' && "bg-primary/15",
                stat.color === 'success' && "bg-success/15",
                stat.color === 'secondary' && "bg-secondary/15",
                stat.color === 'accent' && "bg-accent/15",
              )}>
                <stat.Icon 
                  className={cn(
                    "w-5 h-5",
                    stat.color === 'primary' && "text-primary",
                    stat.color === 'success' && "text-success",
                    stat.color === 'secondary' && "text-secondary",
                    stat.color === 'accent' && "text-accent",
                  )} 
                  size={20} 
                />
              </div>
              <span className="text-xs text-success font-medium">{stat.trend}</span>
            </div>
            <p className="text-2xl font-display font-semibold text-foreground mb-0.5">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryCards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.tab)}
            className={cn(
              "group p-5 rounded-xl bg-card border border-border transition-all duration-200 animate-slide-up",
              "hover:border-primary/40 hover:bg-card/80",
              "flex flex-col items-center gap-3"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center bg-muted transition-all",
              "group-hover:bg-primary group-hover:text-primary-foreground"
            )}>
              <card.Icon className={cn("w-6 h-6", card.color, "group-hover:text-primary-foreground")} size={24} />
            </div>
            <h3 className="font-display text-sm text-foreground">
              {card.title}
            </h3>
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-foreground">Overview</h2>
            <div className="flex items-center gap-1">
              {overviewTabs.slice(0, 3).map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveOverviewTab(tab.name)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors",
                    activeOverviewTab === tab.name
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <tab.Icon className="w-3.5 h-3.5" size={14} />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Task Table */}
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="p-3 w-10"></th>
                  <th className="p-3">Name</th>
                  <th className="p-3 hidden md:table-cell">Category</th>
                  <th className="p-3 hidden lg:table-cell">Due</th>
                  <th className="p-3 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {activeQuests.slice(0, 6).map((quest) => {
                  const style = getCategoryStyle(quest.category);
                  return (
                    <tr 
                      key={quest.id} 
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3">
                        <Checkbox
                          checked={quest.completed}
                          onCheckedChange={() => onCompleteQuest(quest.id)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </td>
                      <td className="p-3 text-sm text-foreground">{quest.title}</td>
                      <td className="p-3 hidden md:table-cell">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs",
                          style.bg, style.text
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
                          {quest.category}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground hidden lg:table-cell">
                        {quest.dueDate ? new Date(quest.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                      </td>
                      <td className="p-3">
                        {getPriorityBadge(quest.xpReward)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-3 border-t border-border/50">
              <button 
                onClick={() => onNavigate('quests')}
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add task
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-4">
          <h3 className="font-display text-lg text-foreground">Quick Actions</h3>
          <MusicPlayer compact />
          <PrayerTimesWidget />
        </div>
      </div>

      {/* Calendar Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-lg text-foreground">Calendar</h2>
          <CalendarWithNotes />
        </div>

        {/* Upcoming */}
        <div className="space-y-4">
          <h3 className="font-display text-lg text-foreground">Upcoming</h3>
          
          <div className="rounded-xl bg-card border border-border p-4 space-y-4">
            {[
              { label: `Today ${new Date().getDate()}`, tasks: upcomingTasks.slice(0, 2) },
              { label: 'Tomorrow', tasks: upcomingTasks.slice(2, 4) },
              { label: 'Next 7 days', tasks: upcomingTasks.slice(4, 6) },
            ].map((section) => (
              <div key={section.label}>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <span className="text-primary">•</span> {section.label}
                </p>
                {section.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 py-2 group">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => onCompleteQuest(task.id)}
                      className="data-[state=checked]:bg-primary"
                    />
                    <span className="text-sm text-foreground flex-1 group-hover:text-primary transition-colors">{task.title}</span>
                    {getPriorityBadge(task.xpReward)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};