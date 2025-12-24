import { useState } from 'react';
import { Calendar, CheckSquare, Book, Dumbbell, Utensils, ChevronLeft, ChevronRight, Plus, Play, Music, MoreHorizontal, CalendarDays, RotateCcw, PenLine, UtensilsCrossed, Plane, Target, Eye, Heart, BookOpen, Clapperboard, Wallet } from 'lucide-react';
import { Quest, Habit, Goal, Stats, UserProfile } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { MusicPlayer } from '@/components/music/MusicPlayer';

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
    icon: CalendarDays,
    items: [
      { name: 'Planner', icon: CalendarDays },
      { name: 'Habits', icon: RotateCcw },
      { name: 'Journal', icon: PenLine }
    ],
    tab: 'quests',
    color: 'primary'
  },
  { 
    id: 'planners', 
    title: 'Planners', 
    icon: UtensilsCrossed,
    items: [
      { name: 'Meal Planner', icon: UtensilsCrossed },
      { name: 'Travel Planner', icon: Plane },
      { name: 'Workout Planner', icon: Dumbbell }
    ],
    tab: 'habits',
    color: 'secondary'
  },
  { 
    id: 'personal', 
    title: 'Personal', 
    icon: BookOpen,
    items: [
      { name: 'Bookshelf', icon: BookOpen },
      { name: 'Movies & Series', icon: Clapperboard },
      { name: 'Finance', icon: Wallet }
    ],
    tab: 'goals',
    color: 'accent'
  },
  { 
    id: 'goals', 
    title: 'Goals', 
    icon: Target,
    items: [
      { name: 'Goals', icon: Target },
      { name: 'Vision', icon: Eye },
      { name: 'Health', icon: Heart }
    ],
    tab: 'goals',
    color: 'destructive'
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
    <div className="space-y-6 animate-slide-up">
      {/* Title Section */}
      <div className="mb-2">
        <h1 className="text-2xl md:text-3xl font-display text-foreground tracking-wide">Life Planner</h1>
        <p className="text-muted-foreground font-body text-sm mt-1">
          All your thoughts in one private place.
        </p>
      </div>

      {/* Category Cards - Icon Based Clean Layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryCards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.tab)}
            className={cn(
              "group p-5 rounded-xl transition-all duration-300 animate-slide-up",
              "bg-card/60 backdrop-blur-sm border border-border/50",
              "hover:bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
              "flex flex-col items-center gap-3"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
              "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
              "group-hover:scale-110"
            )}>
              <card.icon className="w-6 h-6" />
            </div>
            <h3 className="font-display text-base text-foreground">
              {card.title}
            </h3>
          </button>
        ))}
      </div>

      {/* Category Items - Compact List */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryCards.map((card) => (
          <div key={`items-${card.id}`} className="space-y-1">
            {card.items.map((item) => (
              <button 
                key={item.name}
                onClick={() => onNavigate(card.tab)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm group w-full py-1"
              >
                <item.icon className="w-3.5 h-3.5 text-primary/60 group-hover:text-primary transition-colors" />
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
          <MusicPlayer compact />
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
