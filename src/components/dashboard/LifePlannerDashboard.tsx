import { useState } from 'react';
import { Calendar, CheckSquare, Book, Dumbbell, Utensils, ChevronLeft, ChevronRight, Plus, Play, Music, MoreHorizontal } from 'lucide-react';
import { Quest, Habit, Goal, Stats, UserProfile } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import heroBanner from '@/assets/hero-banner.jpg';
import cardDaily from '@/assets/card-daily.jpg';
import cardPlanners from '@/assets/card-planners.jpg';
import cardPersonal from '@/assets/card-personal.jpg';
import cardGoals from '@/assets/card-goals.jpg';

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

const categoryCards = [
  { 
    id: 'daily', 
    title: 'Daily', 
    image: cardDaily,
    items: [
      { name: 'Planner', icon: '📅' },
      { name: 'Habits', icon: '🔄' },
      { name: 'Journal', icon: '✍️' }
    ],
    tab: 'quests',
    color: 'neon-cyan'
  },
  { 
    id: 'planners', 
    title: 'Planners', 
    image: cardPlanners,
    items: [
      { name: 'Meal Planner', icon: '🍽️' },
      { name: 'Travel Planner', icon: '✈️' },
      { name: 'Workout Planner', icon: '💪' }
    ],
    tab: 'habits',
    color: 'neon-magenta'
  },
  { 
    id: 'personal', 
    title: 'Personal', 
    image: cardPersonal,
    items: [
      { name: 'Bookshelf', icon: '📚' },
      { name: 'Movies & Series', icon: '🎬' },
      { name: 'Finance', icon: '💰' }
    ],
    tab: 'goals',
    color: 'neon-purple'
  },
  { 
    id: 'goals', 
    title: 'Goals', 
    image: cardGoals,
    items: [
      { name: 'Goals', icon: '🎯' },
      { name: 'Vision', icon: '👁️' },
      { name: 'Health', icon: '❤️' }
    ],
    tab: 'goals',
    color: 'neon-yellow'
  },
];

const overviewTabs = [
  { name: 'Todo', icon: CheckSquare },
  { name: 'Journal', emoji: '✍️' },
  { name: 'Habits', emoji: '🔄' },
  { name: 'Workout', icon: Dumbbell },
  { name: 'Meal', icon: Utensils },
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
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const activeQuests = quests.filter(q => !q.completed);
  const upcomingTasks = [...quests.filter(q => !q.completed)].slice(0, 6);

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    
    return days;
  };

  const calendarDays = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

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
      {/* Hero Banner */}
      <div className="relative h-48 md:h-56 rounded-2xl overflow-hidden shadow-lg">
        <img 
          src={heroBanner} 
          alt="Life Planner" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* Glowing Orb */}
        <div className="absolute bottom-6 left-6 w-3 h-3 rounded-full bg-primary animate-pulse-glow shadow-[0_0_20px_hsl(var(--primary))]" />
      </div>

      {/* Title Section */}
      <div>
        <h1 className="text-3xl md:text-4xl font-display text-foreground tracking-wide">Life Planner</h1>
        <p className="text-muted-foreground font-body flex items-center gap-2 mt-2 text-base">
          <span className="w-1 h-5 bg-primary rounded-full" />
          All your thoughts in one private place.
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {categoryCards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.tab)}
            className={cn(
              "group relative rounded-2xl overflow-hidden aspect-square transition-all duration-500 animate-slide-up",
              "hover:scale-[1.03] hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)]",
              "ring-2 ring-transparent hover:ring-primary/50"
            )}
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <img 
              src={card.image} 
              alt={card.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="font-display text-xl md:text-2xl text-foreground drop-shadow-lg tracking-wider">
                {card.title}
              </h3>
            </div>
          </button>
        ))}
      </div>

      {/* Category Items */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
        {categoryCards.map((card) => (
          <div key={`items-${card.id}`} className="space-y-1.5">
            {card.items.map((item) => (
              <button 
                key={item.name}
                onClick={() => onNavigate(card.tab)}
                className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors font-body text-sm group"
              >
                <span className="text-sm group-hover:scale-110 transition-transform">{item.icon}</span>
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
          <h2 className="font-display text-xl text-foreground">— Overview</h2>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {overviewTabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveOverviewTab(tab.name)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-body flex items-center gap-1.5 transition-all duration-200",
                  activeOverviewTab === tab.name
                    ? "bg-muted/80 text-foreground ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
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
                {activeQuests.slice(0, 8).map((quest, index) => {
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

        {/* Play Now Widget */}
        <div className="space-y-4">
          <h3 className="font-display text-xl text-foreground">— Play Now</h3>
          <div className="card-gaming rounded-xl p-5 space-y-5 border border-border/50">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-secondary via-primary/80 to-primary flex items-center justify-center shadow-[0_0_25px_hsl(var(--secondary)/0.4)]">
                <Music className="w-9 h-9 text-foreground drop-shadow-md" />
              </div>
              <div className="flex-1 pt-1">
                <p className="font-display text-base text-foreground">Lofi Focus Mix</p>
                <p className="text-sm text-muted-foreground font-body">Pro Chill</p>
                <button className="mt-2.5 flex items-center gap-1.5 text-sm text-primary font-body hover:underline transition-all">
                  <Play className="w-3.5 h-3.5" /> Save on Spotify
                </button>
              </div>
            </div>
            
            {/* Mini Playlist */}
            <div className="space-y-1">
              {['Beats to Focus', 'Study Session', 'Deep Work', 'Calm Vibes'].map((track, i) => (
                <div 
                  key={track}
                  className="flex items-center justify-between py-2.5 border-b border-border/20 last:border-0 group hover:bg-muted/20 -mx-2 px-2 rounded transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-primary text-sm">♫</span>
                    <span className="text-sm font-body text-muted-foreground group-hover:text-foreground transition-colors">{track}</span>
                  </div>
                  <span className="text-xs text-muted-foreground/70 font-body">
                    {`0${i + 2}:${20 + i * 13}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar & Upcoming Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-xl text-foreground">— Calendar</h2>

          {/* Calendar Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {overviewTabs.slice(0, 5).map((tab) => (
              <button
                key={`cal-${tab.name}`}
                className="px-3 py-1.5 rounded-lg text-sm font-body text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
              >
                {tab.name}
              </button>
            ))}
            <span className="text-xs text-muted-foreground/70 ml-1">2 more...</span>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <span className="font-display text-lg text-foreground">{monthName}</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="h-8 w-8">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())} className="h-8 text-xs">
                Today
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="h-8 w-8">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="card-gaming rounded-xl p-4 border border-border/50">
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground font-body mb-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="py-2 font-medium">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const isToday = day === new Date().getDate() && 
                  currentMonth.getMonth() === new Date().getMonth() &&
                  currentMonth.getFullYear() === new Date().getFullYear();
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "aspect-square p-1 rounded-lg text-center font-body text-sm relative flex flex-col items-center justify-center",
                      day ? "hover:bg-muted/50 cursor-pointer transition-colors" : "",
                      isToday && "bg-primary/20 text-primary font-bold ring-1 ring-primary/50"
                    )}
                  >
                    <span>{day}</span>
                    {/* Task indicators */}
                    {day && day % 5 === 0 && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <div className="w-1 h-1 rounded-full bg-secondary" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="space-y-4">
          <h3 className="font-display text-xl text-foreground">— Upcoming</h3>
          
          <div className="space-y-5">
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
