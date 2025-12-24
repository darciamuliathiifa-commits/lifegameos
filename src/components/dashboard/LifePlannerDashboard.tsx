import { useState, useEffect } from 'react';
import { CheckSquare, Plus, Sparkles } from 'lucide-react';
import { Quest, Habit, Goal, Stats, UserProfile } from '@/types/game';
import { Button } from '@/components/ui/button';
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
  if (hour >= 5 && hour < 12) return { text: 'Good Morning', emoji: '☀️', Icon: IconSun };
  if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', emoji: '🌤️', Icon: IconSun };
  if (hour >= 17 && hour < 21) return { text: 'Good Evening', emoji: '🌅', Icon: IconMoon };
  return { text: 'Good Night', emoji: '🌙', Icon: IconMoon };
};

const motivationalQuotes = [
  "Every day is a new beginning. Take a deep breath and start again.",
  "Your only limit is your mind. Dream big, work hard.",
  "Today is the perfect day to start something new.",
  "Small steps every day lead to big changes.",
  "Believe in yourself and all that you are.",
  "The secret of getting ahead is getting started.",
  "Make today so awesome that yesterday gets jealous.",
  "You are capable of amazing things.",
];

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
    gradient: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30'
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
    gradient: 'from-orange-500/20 to-amber-500/20',
    borderColor: 'border-orange-500/30'
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
    gradient: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30'
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
    gradient: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30'
  },
];

const overviewTabs = [
  { name: 'Todo', Icon: IconCheck },
  { name: 'Journal', emoji: '✍️' },
  { name: 'Habits', emoji: '🔄' },
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
  const [quote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeQuests = quests.filter(q => !q.completed);
  const upcomingTasks = [...quests.filter(q => !q.completed)].slice(0, 6);

  const getCategoryStyle = (category: string) => {
    switch(category) {
      case 'health': return { bg: 'bg-destructive/20', text: 'text-destructive', dot: 'bg-destructive' };
      case 'productivity': return { bg: 'bg-primary/20', text: 'text-primary', dot: 'bg-primary' };
      case 'learning': return { bg: 'bg-secondary/20', text: 'text-secondary', dot: 'bg-secondary' };
      case 'social': return { bg: 'bg-neon-magenta/20', text: 'text-neon-magenta', dot: 'bg-neon-magenta' };
      case 'creative': return { bg: 'bg-accent/20', text: 'text-accent', dot: 'bg-accent' };
      default: return { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground' };
    }
  };

  const getPriorityBadge = (xp: number) => {
    if (xp >= 100) return <span className="px-2 py-0.5 rounded text-xs bg-destructive/20 text-destructive border border-destructive/30 font-body">High</span>;
    if (xp >= 50) return <span className="px-2 py-0.5 rounded text-xs bg-accent/20 text-accent border border-accent/30 font-body">Mid</span>;
    return null;
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 p-6 md:p-8">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Time & Greeting */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6">
            <div className="text-5xl md:text-7xl font-display text-primary text-glow tabular-nums tracking-tight">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className="h-px md:h-16 md:w-px bg-gradient-to-r md:bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{greeting.emoji}</span>
                <h1 className="text-2xl md:text-3xl font-display text-foreground">{greeting.text}!</h1>
              </div>
              <p className="text-muted-foreground font-body mt-1">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="relative">
            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent rounded-full" />
            <div className="pl-4 flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5 animate-pulse" />
              <p className="text-base md:text-lg font-body text-foreground/80 leading-relaxed italic">
                "{quote}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Cards - Icon Based Clean Layout with Gradients */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryCards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.tab)}
            className={cn(
              "group p-5 rounded-xl transition-all duration-300 animate-slide-up",
              "bg-gradient-to-br backdrop-blur-sm border",
              card.gradient,
              card.borderColor,
              "hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02]",
              "flex flex-col items-center gap-3"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300",
              "bg-background/50 group-hover:bg-primary group-hover:text-primary-foreground",
              "group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30"
            )}>
              <card.Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
            </div>
            <h3 className="font-display text-base text-foreground">
              {card.title}
            </h3>
          </button>
        ))}
      </div>

      {/* Category Items - Compact List with Clean Icons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryCards.map((card) => (
          <div key={`items-${card.id}`} className="space-y-1">
            {card.items.map((item) => (
              <button 
                key={item.name}
                onClick={() => onNavigate(card.tab)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm group w-full py-1.5"
              >
                <item.Icon className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" size={16} />
                <span className="group-hover:translate-x-0.5 transition-transform">{item.name}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Overview Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Todo List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-xl text-foreground flex items-center gap-2">
            <span className="text-primary">—</span> Overview
          </h2>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {overviewTabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveOverviewTab(tab.name)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-body flex items-center gap-1.5 transition-all duration-200",
                  activeOverviewTab === tab.name
                    ? "bg-primary/20 text-primary ring-1 ring-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                {tab.Icon && <tab.Icon className="w-3.5 h-3.5" size={14} />}
                {tab.emoji && <span className="text-xs">{tab.emoji}</span>}
                {tab.name}
              </button>
            ))}
            <span className="text-xs text-muted-foreground/70 ml-1">3 more...</span>
          </div>

          {/* Task Table */}
          <div className="card-gaming rounded-xl overflow-hidden border border-border/50">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr className="text-left text-xs text-muted-foreground font-body uppercase tracking-wider">
                  <th className="p-3 w-10"></th>
                  <th className="p-3">Name</th>
                  <th className="p-3 hidden md:table-cell">Category</th>
                  <th className="p-3 hidden lg:table-cell">Due Date</th>
                  <th className="p-3 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {activeQuests.slice(0, 8).map((quest) => {
                  const style = getCategoryStyle(quest.category);
                  return (
                    <tr 
                      key={quest.id} 
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors group"
                    >
                      <td className="p-3">
                        <Checkbox
                          checked={quest.completed}
                          onCheckedChange={() => onCompleteQuest(quest.id)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-border/60"
                        />
                      </td>
                      <td className="p-3 font-body text-foreground">{quest.title}</td>
                      <td className="p-3 hidden md:table-cell">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-body",
                          style.bg, style.text
                        )}>
                          <span className={cn("w-2 h-2 rounded-full", style.dot)} />
                          {quest.category.charAt(0).toUpperCase() + quest.category.slice(1)}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground font-body hidden lg:table-cell">
                        {quest.dueDate ? new Date(quest.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                      </td>
                      <td className="p-3">
                        {getPriorityBadge(quest.xpReward)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-3 border-t border-border/30 bg-muted/20">
              <button 
                onClick={() => onNavigate('quests')}
                className="text-sm text-muted-foreground hover:text-primary font-body flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> New
              </button>
            </div>
          </div>
        </div>

        {/* Play Now & Prayer Times */}
        <div className="space-y-4">
          <h3 className="font-display text-xl text-foreground flex items-center gap-2">
            <span className="text-primary">—</span> Play Now
          </h3>
          <MusicPlayer compact />
          <PrayerTimesWidget />
        </div>
      </div>

      {/* Calendar & Upcoming Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar with Notes Sync */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-xl text-foreground flex items-center gap-2">
            <span className="text-primary">—</span> Calendar
          </h2>
          <CalendarWithNotes />
        </div>

        {/* Upcoming */}
        <div className="space-y-4">
          <h3 className="font-display text-xl text-foreground flex items-center gap-2">
            <span className="text-primary">—</span> Upcoming
          </h3>
          
          <div className="space-y-5 card-gaming rounded-xl p-4 border border-border/50">
            <div>
              <p className="text-xs text-muted-foreground/80 font-body mb-2.5 flex items-center gap-1">
                <span className="text-primary">▼</span> Today {new Date().getDate()}
              </p>
              {upcomingTasks.slice(0, 2).map((task) => (
                <div key={task.id} className="flex items-center gap-3 py-2 group">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => onCompleteQuest(task.id)}
                    className="border-border/60"
                  />
                  <span className="text-sm font-body text-foreground flex-1 group-hover:text-primary transition-colors">{task.title}</span>
                  {getPriorityBadge(task.xpReward)}
                </div>
              ))}
              <button className="text-xs text-muted-foreground hover:text-primary font-body flex items-center gap-1 mt-2 transition-colors">
                <Plus className="w-3 h-3" /> New
              </button>
            </div>

            <div>
              <p className="text-xs text-muted-foreground/80 font-body mb-2.5 flex items-center gap-1">
                <span className="text-primary">▼</span> Tomorrow
              </p>
              {upcomingTasks.slice(2, 4).map((task) => (
                <div key={task.id} className="flex items-center gap-3 py-2 group">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => onCompleteQuest(task.id)}
                    className="border-border/60"
                  />
                  <span className="text-sm font-body text-foreground flex-1 group-hover:text-primary transition-colors">{task.title}</span>
                  {getPriorityBadge(task.xpReward)}
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs text-muted-foreground/80 font-body mb-2.5 flex items-center gap-1">
                <span className="text-primary">▼</span> Next 7 days
              </p>
              {upcomingTasks.slice(4, 6).map((task) => (
                <div key={task.id} className="flex items-center gap-3 py-2 group">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => onCompleteQuest(task.id)}
                    className="border-border/60"
                  />
                  <span className="text-sm font-body text-foreground flex-1 group-hover:text-primary transition-colors">{task.title}</span>
                  {getPriorityBadge(task.xpReward)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
