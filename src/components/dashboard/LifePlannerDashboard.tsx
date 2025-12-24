import { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronLeft, ChevronRight, Check, MoreHorizontal } from 'lucide-react';
import { Quest, Habit, Goal, Stats, UserProfile } from '@/types/game';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MusicPlayer } from '@/components/music/MusicPlayer';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, addDays } from 'date-fns';
import { 
  IconCalendar, IconHabits, IconJournal, IconMeal, IconTravel, IconWorkout,
  IconBook, IconMovie, IconWallet, IconTarget, IconVision, IconHeart,
  IconPlanner, IconCheck
} from '@/components/icons/CleanIcons';

// Images for category cards
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

// Dummy data for demonstration
const dummyTodos = [
  { id: '1', title: 'Write blog post', category: 'Work', dueDate: '2024-01-26', priority: 'High' },
  { id: '2', title: 'Write blog post', category: 'Work', dueDate: '2024-01-27', priority: 'High' },
  { id: '3', title: 'Meet Carl', category: 'Life', dueDate: '2024-01-27', priority: null },
  { id: '4', title: 'Edit Photo', category: 'Work', dueDate: '2024-01-28', priority: null },
  { id: '5', title: 'Write blog post', category: 'Work', dueDate: '2024-01-28', priority: 'High' },
  { id: '6', title: 'Edit Website', category: 'Work', dueDate: '2024-02-12', priority: 'High' },
  { id: '7', title: 'Create Social Content', category: 'Life', dueDate: '2024-02-13', priority: null },
  { id: '8', title: 'Run', category: 'Health', dueDate: '2024-02-14', priority: null },
  { id: '9', title: 'Edit Website', category: 'Work', dueDate: '2024-02-19', priority: 'High' },
  { id: '10', title: 'Write copy', category: 'Work', dueDate: '2024-02-19', priority: 'High' },
];

const dummyCalendarEvents = [
  { date: new Date(2024, 1, 12), title: 'Edit', category: 'Work', priority: 'High' },
  { date: new Date(2024, 1, 13), title: 'Create', category: 'Life', priority: null },
  { date: new Date(2024, 1, 14), title: 'Run', category: 'Health', priority: null },
  { date: new Date(2024, 1, 19), title: 'Edit', category: 'Work', priority: 'High' },
  { date: new Date(2024, 1, 20), title: 'Edit Photo', category: 'Life', priority: null },
  { date: new Date(2024, 1, 21), title: 'Create', category: 'Work', priority: null },
  { date: new Date(2024, 1, 22), title: 'Edit', category: 'Personal', priority: 'High' },
  { date: new Date(2024, 1, 23), title: 'Run', category: 'Health', priority: null },
  { date: new Date(2024, 1, 24), title: 'Edit Photo', category: 'Health', priority: null },
  { date: new Date(2024, 1, 26), title: 'Record', category: 'Work', priority: 'High' },
  { date: new Date(2024, 1, 27), title: 'Go', category: 'Health', priority: 'High' },
  { date: new Date(2024, 1, 28), title: 'Create', category: 'Life', priority: null },
];

const dummyUpcoming = {
  today: [
    { id: 't1', title: 'Edit Website', priority: 'High' },
    { id: 't2', title: 'Write copy', priority: 'High' },
  ],
  tomorrow: [
    { id: 'tm1', title: 'Edit Photo', priority: null },
    { id: 'tm2', title: 'Write blog post', priority: 'High' },
  ],
  next7days: [
    { id: 'n1', title: 'Run', priority: null },
    { id: 'n2', title: 'Edit Website', priority: 'High' },
    { id: 'n3', title: 'Record video', priority: 'High' },
    { id: 'n4', title: 'Create Social Content', priority: null },
    { id: 'n5', title: 'Call Repairman', priority: null },
    { id: 'n6', title: 'Edit Photo', priority: null },
    { id: 'n7', title: 'Manage Finance', priority: null },
  ],
};

const dummyHabits = [
  { name: 'Workout', icon: '💪', completed: false },
  { name: 'Meditate', icon: '🧘', completed: false },
  { name: 'Read', icon: '📚', completed: false },
  { name: 'Run', icon: '🏃', completed: false },
  { name: 'Cold Shower', icon: '🥶', completed: false },
];

const dummyMeals = [
  { type: 'Dinner', day: 'Monday', name: 'Chicken Noodle Soup' },
  { type: 'Lunch', day: 'Monday', name: 'Brick-Oven Pizza (Brooklyn Style)' },
  { type: 'Breakfast', day: 'Monday', name: '' },
];

const dummyShopping = [
  '6 leaves fresh basil, torn',
  '3 cups bread flour',
  '1 tablespoon extra-virgin olive...',
  '2 tablespoons extra-virgin oli...',
  'Onion',
  '1 cup cold water',
];

const categoryCards = [
  { 
    id: 'daily', 
    title: 'Daily', 
    image: cardDaily,
    items: [
      { name: 'Planner', Icon: IconPlanner },
      { name: 'Habits', Icon: IconHabits },
      { name: 'Journal', Icon: IconJournal }
    ],
    tab: 'quests'
  },
  { 
    id: 'planners', 
    title: 'Planners', 
    image: cardPlanners,
    items: [
      { name: 'Meal Planner', Icon: IconMeal },
      { name: 'Travel Planner', Icon: IconTravel },
      { name: 'Workout Planner', Icon: IconWorkout }
    ],
    tab: 'habits'
  },
  { 
    id: 'personal', 
    title: 'Personal', 
    image: cardPersonal,
    items: [
      { name: 'Bookshelf', Icon: IconBook },
      { name: 'Movies & Series', Icon: IconMovie },
      { name: 'Finance', Icon: IconWallet }
    ],
    tab: 'goals'
  },
  { 
    id: 'goals', 
    title: 'Goals', 
    image: cardGoals,
    items: [
      { name: 'Goals', Icon: IconTarget },
      { name: 'Vision', Icon: IconVision },
      { name: 'Health', Icon: IconHeart }
    ],
    tab: 'goals'
  },
];

const overviewTabs = [
  { name: 'Todo', Icon: IconCheck },
  { name: 'Journal', Icon: IconJournal },
  { name: 'Habits', Icon: IconHabits },
  { name: 'Workout', Icon: IconWorkout },
  { name: 'Meal', Icon: IconMeal },
];

const getCategoryStyle = (category: string) => {
  switch(category.toLowerCase()) {
    case 'work': return { bg: 'bg-primary/15', text: 'text-primary', dot: 'bg-primary' };
    case 'health': return { bg: 'bg-destructive/15', text: 'text-destructive', dot: 'bg-destructive' };
    case 'life': return { bg: 'bg-secondary/15', text: 'text-secondary', dot: 'bg-secondary' };
    case 'personal': return { bg: 'bg-accent/15', text: 'text-accent', dot: 'bg-accent' };
    default: return { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground' };
  }
};

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
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 1, 1)); // February 2024 for demo
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const today = new Date();

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Calendar logic
  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    const startDayOfWeek = getDay(start);
    const paddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    return { days, paddingDays };
  };

  const { days, paddingDays } = getDaysInMonth();
  const monthName = format(currentMonth, 'MMMM yyyy');

  const getEventsForDate = (date: Date) => {
    return dummyCalendarEvents.filter(e => isSameDay(e.date, date));
  };

  return (
    <div className="space-y-8 animate-slide-up pb-8">
      {/* Hero Banner */}
      <div className="relative h-32 md:h-40 -mx-4 md:-mx-6 -mt-4 md:-mt-6 overflow-hidden rounded-b-2xl">
        <img 
          src={cardDaily} 
          alt="Life Planner Banner" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-4 left-6">
          <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center mb-2">
            <span className="text-sm">🌙</span>
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="space-y-2 px-2">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
          Life Planner
        </h1>
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-primary rounded-full" />
          <p className="text-muted-foreground text-sm">All your thoughts in one private place.</p>
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
        {categoryCards.map((card, index) => (
          <div
            key={card.id}
            className="space-y-3 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Image Card */}
            <button
              onClick={() => onNavigate(card.tab)}
              className="relative w-full aspect-[4/3] rounded-xl overflow-hidden group"
            >
              <img 
                src={card.image} 
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <h3 className="text-white font-display font-semibold text-lg drop-shadow-lg">
                  {card.title}
                </h3>
              </div>
            </button>
            
            {/* Sub Items */}
            <div className="space-y-1">
              {card.items.map((item) => (
                <button
                  key={item.name}
                  onClick={() => onNavigate(card.tab)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left py-0.5"
                >
                  <item.Icon className="w-3.5 h-3.5 text-primary" size={14} />
                  <span className="font-body">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Overview Section */}
      <div className="space-y-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">—</span>
          <h2 className="font-display text-lg text-foreground">Overview</h2>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {overviewTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveOverviewTab(tab.name)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors",
                activeOverviewTab === tab.name
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <tab.Icon className="w-3.5 h-3.5" size={14} />
              {tab.name}
            </button>
          ))}
          <button className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            3 more...
          </button>
        </div>

        {/* Overview Grid - Table + Music Player */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Task Table */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50 bg-muted/20">
                    <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="p-3 w-10"></th>
                      <th className="p-3 w-6">
                        <div className="w-4 h-4 rounded border border-border" />
                      </th>
                      <th className="p-3">
                        <span className="flex items-center gap-1">Aa Name</span>
                      </th>
                      <th className="p-3 hidden md:table-cell">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          Category
                        </span>
                      </th>
                      <th className="p-3 hidden lg:table-cell">
                        <span className="flex items-center gap-1">📅 Due Date</span>
                      </th>
                      <th className="p-3 w-16">
                        <span className="flex items-center gap-1">⚠️ P...</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyTodos.map((todo) => {
                      const style = getCategoryStyle(todo.category);
                      return (
                        <tr 
                          key={todo.id} 
                          className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                        >
                          <td className="p-3">
                            <Checkbox
                              checked={checkedItems.has(todo.id)}
                              onCheckedChange={() => toggleCheck(todo.id)}
                              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                          </td>
                          <td className="p-3">
                            <div className={cn(
                              "w-4 h-4 rounded-full border-2",
                              style.text,
                              "border-current"
                            )} />
                          </td>
                          <td className={cn(
                            "p-3 text-sm",
                            checkedItems.has(todo.id) ? "text-muted-foreground line-through" : "text-foreground"
                          )}>
                            {todo.title}
                          </td>
                          <td className="p-3 hidden md:table-cell">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs",
                              style.bg, style.text
                            )}>
                              <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
                              {todo.category}
                            </span>
                          </td>
                          <td className="p-3 text-xs text-muted-foreground hidden lg:table-cell">
                            {format(new Date(todo.dueDate), 'MMMM d, yyyy')}
                          </td>
                          <td className="p-3">
                            {todo.priority === 'High' && (
                              <span className="px-2 py-0.5 rounded text-xs bg-destructive/15 text-destructive font-medium">
                                High
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-border/30 flex items-center justify-between">
                <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
                  Load more <MoreHorizontal className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onNavigate('quests')}
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> New
                </button>
              </div>
            </Card>
          </div>

          {/* Music Player */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">—</span>
              <h3 className="font-display text-base text-foreground">Play Now</h3>
            </div>
            <MusicPlayer compact />
          </div>
        </div>
      </div>

      {/* Calendar & Upcoming Section */}
      <div className="grid lg:grid-cols-3 gap-6 px-2">
        {/* Calendar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">—</span>
            <h2 className="font-display text-lg text-foreground">Calendar</h2>
          </div>

          {/* Calendar Tabs */}
          <div className="flex items-center gap-1 flex-wrap">
            {overviewTabs.slice(0, 4).map((tab) => (
              <button
                key={tab.name}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors",
                  tab.name === 'Todo'
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.Icon className="w-3.5 h-3.5" size={14} />
                {tab.name}
              </button>
            ))}
            <button className="px-3 py-1.5 text-sm text-muted-foreground">2 more...</button>
          </div>

          {/* Calendar */}
          <Card className="border-border/50">
            <CardContent className="py-5">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-lg text-foreground">{monthName}</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs gap-1.5">
                    📅 Open in Calendar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentMonth(new Date())} 
                    className="h-8 text-xs"
                  >
                    Today
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
                    className="h-8 w-8"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="py-2 font-medium">{day}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: paddingDays }).map((_, index) => (
                  <div key={`padding-${index}`} className="aspect-square p-1 text-center text-sm text-muted-foreground/50">
                    {index === paddingDays - 1 ? 29 + index - paddingDays + 1 : ''}
                  </div>
                ))}
                
                {days.map((date) => {
                  const events = getEventsForDate(date);
                  const isToday = format(date, 'yyyy-MM-dd') === '2024-02-19'; // Demo today
                  
                  return (
                    <div
                      key={date.toISOString()}
                      className={cn(
                        "min-h-[80px] p-1 rounded-lg text-sm relative border border-transparent transition-colors",
                        isToday && "bg-primary/10 ring-2 ring-primary",
                        !isToday && "hover:bg-muted/30"
                      )}
                    >
                      <span className={cn(
                        "block text-center mb-1",
                        isToday ? "text-primary font-bold" : "text-muted-foreground"
                      )}>
                        {format(date, 'd')}
                      </span>
                      
                      {/* Events */}
                      <div className="space-y-0.5">
                        {events.slice(0, 3).map((event, idx) => {
                          const style = getCategoryStyle(event.category);
                          return (
                            <div 
                              key={idx}
                              className={cn(
                                "text-[10px] truncate rounded px-1 py-0.5",
                                style.bg, style.text
                              )}
                            >
                              {event.title}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">—</span>
              <h3 className="font-display text-lg text-foreground">Upcoming</h3>
            </div>
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              ≡ All <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <Card className="border-border/50">
            <CardContent className="py-4 space-y-4">
              {/* Today */}
              <div>
                <button className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <ChevronDown className="w-3 h-3" />
                  <span className="text-primary">Today</span>
                  <span className="text-xs">{dummyUpcoming.today.length}</span>
                </button>
                <div className="space-y-2 pl-4">
                  {dummyUpcoming.today.map((task) => (
                    <div key={task.id} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full border-2 border-primary" />
                      <span className="text-sm text-foreground flex-1">{task.title}</span>
                      {task.priority && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-destructive/15 text-destructive">
                          High
                        </span>
                      )}
                      <Checkbox className="w-4 h-4" />
                    </div>
                  ))}
                  <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <Plus className="w-3 h-3" /> New
                  </button>
                </div>
              </div>

              {/* Tomorrow */}
              <div>
                <button className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <ChevronDown className="w-3 h-3" />
                  <span className="text-primary">Tomorrow</span>
                  <span className="text-xs">{dummyUpcoming.tomorrow.length}</span>
                </button>
                <div className="space-y-2 pl-4">
                  {dummyUpcoming.tomorrow.map((task) => (
                    <div key={task.id} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full border-2 border-secondary" />
                      <span className="text-sm text-foreground flex-1">{task.title}</span>
                      {task.priority && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-destructive/15 text-destructive">
                          High
                        </span>
                      )}
                      <Checkbox className="w-4 h-4" />
                    </div>
                  ))}
                  <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <Plus className="w-3 h-3" /> New
                  </button>
                </div>
              </div>

              {/* Next 7 days */}
              <div>
                <button className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <ChevronDown className="w-3 h-3" />
                  <span className="text-primary">Next 7 days</span>
                  <span className="text-xs">{dummyUpcoming.next7days.length}</span>
                </button>
                <div className="space-y-2 pl-4">
                  {dummyUpcoming.next7days.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full border-2 border-muted-foreground" />
                      <span className="text-sm text-foreground flex-1">{task.title}</span>
                      {task.priority && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-destructive/15 text-destructive">
                          High
                        </span>
                      )}
                      <Checkbox className="w-4 h-4" />
                    </div>
                  ))}
                  <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <Plus className="w-3 h-3" /> New
                  </button>
                </div>
              </div>

              <button className="text-xs text-muted-foreground hover:text-foreground">
                ▽ 2 hidden groups
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
        {/* Habit Tracker */}
        <Card className="border-border/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">—</span>
                <h3 className="font-display text-sm text-foreground">Habit Tracker</h3>
              </div>
              <button className="flex items-center gap-1 text-xs text-muted-foreground">
                📅 Today <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-3 h-3 rounded-full border-2 border-destructive" />
                <span className="text-sm">Monday</span>
              </div>
              <div className="text-xs text-muted-foreground">0%</div>
              
              <div className="space-y-2">
                {dummyHabits.map((habit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Checkbox className="w-4 h-4" />
                    <span className="text-xs">{habit.icon}</span>
                    <span className="text-muted-foreground">{habit.name}</span>
                  </div>
                ))}
              </div>

              <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                <Plus className="w-3 h-3 mr-1" /> New
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Meal Planner */}
        <Card className="border-border/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">—</span>
                <h3 className="font-display text-sm text-foreground">Meal Planner</h3>
              </div>
              <button className="flex items-center gap-1 text-xs text-muted-foreground">
                🍴 Today <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-3">
              {dummyMeals.map((meal, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">🍽️</span>
                    <span className="text-sm text-foreground">{meal.type}</span>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-primary/15 text-primary">
                    {meal.day}
                  </span>
                  {meal.name && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      🥘 {meal.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shopping List */}
        <Card className="border-border/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">—</span>
                <h3 className="font-display text-sm text-foreground">Shopping List</h3>
              </div>
              <button className="flex items-center gap-1 text-xs text-muted-foreground">
                🛒 Shopping List <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-2">
              {dummyShopping.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">≡</span>
                  <span className="text-muted-foreground truncate">{item}</span>
                </div>
              ))}
              <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mt-2">
                <Plus className="w-3 h-3" /> New
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Finance */}
        <Card className="border-border/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">—</span>
                <h3 className="font-display text-sm text-foreground">Finance</h3>
              </div>
              <button className="flex items-center gap-1 text-xs text-muted-foreground">
                📅 This month <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">📅 2024 February</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Income</span>
                  <span className="text-foreground">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Expenses</span>
                  <span className="text-foreground">$0.00</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border/50">
                  <span className="text-muted-foreground">Balance</span>
                  <span className="text-foreground font-medium">$0.00</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-success">
                <span>↑</span>
                <span>0% vs Last Month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
