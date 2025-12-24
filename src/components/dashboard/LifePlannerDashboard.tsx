import { useState } from 'react';
import { Calendar, CheckSquare, Book, Dumbbell, Utensils, ChevronLeft, ChevronRight, Plus, Play, Music } from 'lucide-react';
import { Quest, Habit, Goal, Stats, UserProfile } from '@/types/game';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
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
    items: ['Planner', 'Habits', 'Journal'],
    tab: 'quests'
  },
  { 
    id: 'planners', 
    title: 'Planners', 
    image: cardPlanners,
    items: ['Meal Planner', 'Travel Planner', 'Workout Planner'],
    tab: 'habits'
  },
  { 
    id: 'personal', 
    title: 'Personal', 
    image: cardPersonal,
    items: ['Bookshelf', 'Movies & Series', 'Finance'],
    tab: 'goals'
  },
  { 
    id: 'goals', 
    title: 'Goals', 
    image: cardGoals,
    items: ['Goals', 'Vision', 'Health'],
    tab: 'goals'
  },
];

const overviewTabs = ['Todo', 'Journal', 'Habits', 'Workout', 'Meal'];

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
    
    // Add empty days for padding
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    
    return days;
  };

  const calendarDays = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'health': return '❤️';
      case 'productivity': return '💼';
      case 'social': return '👥';
      case 'learning': return '📚';
      case 'creative': return '🎨';
      default: return '📋';
    }
  };

  const getPriorityBadge = (xp: number) => {
    if (xp >= 100) return <span className="px-2 py-0.5 rounded text-xs bg-destructive/20 text-destructive font-body">High</span>;
    if (xp >= 50) return <span className="px-2 py-0.5 rounded text-xs bg-accent/20 text-accent font-body">Mid</span>;
    return null;
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
        <img 
          src={heroBanner} 
          alt="Life Planner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        
        {/* Glowing Orb */}
        <div className="absolute bottom-6 left-6 w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
      </div>

      {/* Title Section */}
      <div>
        <h1 className="text-3xl font-display text-foreground">Life Planner</h1>
        <p className="text-muted-foreground font-body flex items-center gap-2 mt-1">
          <span className="w-0.5 h-4 bg-primary" />
          All your thoughts in one private place.
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categoryCards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.tab)}
            className="group relative rounded-xl overflow-hidden aspect-[4/3] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <img 
              src={card.image} 
              alt={card.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-display text-lg text-foreground">{card.title}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* Category Items */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {categoryCards.map((card) => (
          <div key={`items-${card.id}`} className="space-y-1">
            {card.items.map((item) => (
              <button 
                key={item}
                onClick={() => onNavigate(card.tab)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body"
              >
                <span className="text-xs">
                  {item.includes('Planner') ? '📅' : 
                   item.includes('Habits') ? '🔄' : 
                   item.includes('Journal') ? '✍️' :
                   item.includes('Meal') ? '🍽️' :
                   item.includes('Travel') ? '✈️' :
                   item.includes('Workout') ? '💪' :
                   item.includes('Book') ? '📚' :
                   item.includes('Movies') ? '🎬' :
                   item.includes('Finance') ? '💰' :
                   item.includes('Goals') ? '🎯' :
                   item.includes('Vision') ? '👁️' :
                   item.includes('Health') ? '❤️' : '📋'}
                </span>
                {item}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Overview Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Todo List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-foreground">— Overview</h2>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {overviewTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveOverviewTab(tab)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-body flex items-center gap-2 transition-all",
                  activeOverviewTab === tab
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === 'Todo' && <CheckSquare className="w-3 h-3" />}
                {tab === 'Journal' && <span>✍️</span>}
                {tab === 'Habits' && <span>🔄</span>}
                {tab === 'Workout' && <Dumbbell className="w-3 h-3" />}
                {tab === 'Meal' && <Utensils className="w-3 h-3" />}
                {tab}
              </button>
            ))}
            <span className="text-xs text-muted-foreground">3 more...</span>
          </div>

          {/* Task Table */}
          <div className="card-gaming rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-left text-xs text-muted-foreground font-body uppercase tracking-wider">
                  <th className="p-3 w-8"></th>
                  <th className="p-3">Name</th>
                  <th className="p-3 hidden md:table-cell">Category</th>
                  <th className="p-3 hidden lg:table-cell">Due Date</th>
                  <th className="p-3 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {activeQuests.slice(0, 8).map((quest) => (
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
                    <td className="p-3 font-body text-foreground">{quest.title}</td>
                    <td className="p-3 hidden md:table-cell">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-body",
                        quest.category === 'productivity' && "bg-primary/20 text-primary",
                        quest.category === 'health' && "bg-destructive/20 text-destructive",
                        quest.category === 'learning' && "bg-secondary/20 text-secondary",
                        quest.category === 'social' && "bg-neon-magenta/20 text-neon-magenta",
                        quest.category === 'creative' && "bg-accent/20 text-accent",
                      )}>
                        {getCategoryIcon(quest.category)} {quest.category.charAt(0).toUpperCase() + quest.category.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground font-body hidden lg:table-cell">
                      {quest.dueDate ? new Date(quest.dueDate).toLocaleDateString() : 'No date'}
                    </td>
                    <td className="p-3">
                      {getPriorityBadge(quest.xpReward)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3 border-t border-border">
              <button 
                onClick={() => onNavigate('quests')}
                className="text-sm text-muted-foreground hover:text-foreground font-body flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> New
              </button>
            </div>
          </div>
        </div>

        {/* Play Now Widget */}
        <div className="space-y-4">
          <h3 className="font-display text-lg text-foreground">— Play Now</h3>
          <div className="card-gaming rounded-xl p-4 space-y-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <Music className="w-8 h-8 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-display text-sm text-foreground">Lofi Focus Mix</p>
                <p className="text-xs text-muted-foreground font-body">Pro Chill</p>
                <button className="mt-2 flex items-center gap-1 text-xs text-primary font-body hover:underline">
                  <Play className="w-3 h-3" /> Save on Spotify
                </button>
              </div>
            </div>
            
            {/* Mini Playlist */}
            <div className="space-y-2">
              {['Beats to Focus', 'Study Session', 'Deep Work', 'Calm Vibes'].map((track, i) => (
                <div 
                  key={track}
                  className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary">♫</span>
                    <span className="text-sm font-body text-muted-foreground">{track}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-body">
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
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-foreground">— Calendar</h2>
          </div>

          {/* Calendar Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {overviewTabs.slice(0, 5).map((tab) => (
              <button
                key={`cal-${tab}`}
                className="px-3 py-1.5 rounded-lg text-sm font-body text-muted-foreground hover:text-foreground transition-all"
              >
                {tab}
              </button>
            ))}
            <span className="text-xs text-muted-foreground">2 more...</span>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <span className="font-display text-foreground">{monthName}</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
                Today
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="card-gaming rounded-xl p-4">
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground font-body mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="py-2">{day}</div>
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
                      "aspect-square p-1 rounded-lg text-center font-body text-sm relative",
                      day ? "hover:bg-muted cursor-pointer" : "",
                      isToday && "bg-primary/20 text-primary font-bold"
                    )}
                  >
                    {day}
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
          <h3 className="font-display text-lg text-foreground">— Upcoming</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground font-body mb-2">▼ Today {new Date().getDate()}</p>
              {upcomingTasks.slice(0, 2).map((task) => (
                <div key={task.id} className="flex items-center gap-3 py-2">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => onCompleteQuest(task.id)}
                  />
                  <span className="text-sm font-body text-foreground flex-1">{task.title}</span>
                  {getPriorityBadge(task.xpReward)}
                </div>
              ))}
              <button className="text-xs text-muted-foreground hover:text-foreground font-body flex items-center gap-1 mt-1">
                <Plus className="w-3 h-3" /> New
              </button>
            </div>

            <div>
              <p className="text-xs text-muted-foreground font-body mb-2">▼ Tomorrow</p>
              {upcomingTasks.slice(2, 4).map((task) => (
                <div key={task.id} className="flex items-center gap-3 py-2">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => onCompleteQuest(task.id)}
                  />
                  <span className="text-sm font-body text-foreground flex-1">{task.title}</span>
                  {getPriorityBadge(task.xpReward)}
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs text-muted-foreground font-body mb-2">▼ Next 7 days</p>
              {upcomingTasks.slice(4, 6).map((task) => (
                <div key={task.id} className="flex items-center gap-3 py-2">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => onCompleteQuest(task.id)}
                  />
                  <span className="text-sm font-body text-foreground flex-1">{task.title}</span>
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
