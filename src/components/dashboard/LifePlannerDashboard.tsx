import { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Loader2 } from 'lucide-react';
import { Quest, Habit, Goal, Stats, UserProfile } from '@/types/game';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MusicPlayer } from '@/components/music/MusicPlayer';
import { PrayerTimesWidget } from '@/components/prayers/PrayerTimesWidget';
import { NoteDetailSheet } from '@/components/notes/NoteDetailSheet';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isToday, addDays, startOfDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  IconCalendar, IconHabits, IconJournal, IconMeal, IconTravel, IconWorkout,
  IconBook, IconMovie, IconWallet, IconTarget, IconVision, IconHeart,
  IconPlanner, IconCheck, IconMoon
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

interface FinanceTransaction {
  id: string;
  type: string;
  amount: number;
  title: string;
  date: string;
}

interface Note {
  id: string;
  title: string;
  content: string | null;
  category: string;
  is_pinned: boolean;
  created_at: string;
}

interface QuickMenuItem {
  name: string;
  Icon: React.ComponentType<{ className?: string; size?: number }>;
  category: string;
  defaultContent: string;
}

const quickMenuItems: QuickMenuItem[] = [
  { name: 'Planner', Icon: IconPlanner, category: 'planner', defaultContent: '## Planner\n\n### Today\'s Tasks\n- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3\n\n### Schedule\n- 08:00 - Morning routine\n- 09:00 - Work\n- 12:00 - Lunch\n- 13:00 - Work\n- 18:00 - Evening' },
  { name: 'Habits', Icon: IconHabits, category: 'habits', defaultContent: '## Habits Tracker\n\n### Daily Habits\n- [ ] Exercise\n- [ ] Read\n- [ ] Meditate\n- [ ] Drink water\n\n### Weekly Review\n- ' },
  { name: 'Journal', Icon: IconJournal, category: 'journal', defaultContent: '## Journal Entry\n\n### Date: ' + new Date().toLocaleDateString() + '\n\n### Thoughts\n- \n\n### Gratitude\n- \n\n### Reflections\n- ' },
  { name: 'Meal Planner', Icon: IconMeal, category: 'meal', defaultContent: '## Meal Planner\n\n### Breakfast\n- \n\n### Lunch\n- \n\n### Dinner\n- \n\n### Snacks\n- ' },
  { name: 'Travel Planner', Icon: IconTravel, category: 'travel', defaultContent: '## Travel Planner\n\n### Destination\n- \n\n### Dates\n- \n\n### Packing List\n- [ ] Passport\n- [ ] Tickets\n- [ ] Clothes\n\n### Itinerary\n- ' },
  { name: 'Workout Planner', Icon: IconWorkout, category: 'workout', defaultContent: '## Workout Planner\n\n### Today\'s Workout\n- [ ] Warm up\n- [ ] Cardio\n- [ ] Strength\n- [ ] Cool down\n\n### Weekly Schedule\n- Monday: \n- Tuesday: \n- Wednesday: \n- Thursday: \n- Friday: ' },
  { name: 'Bookshelf', Icon: IconBook, category: 'bookshelf', defaultContent: '## My Bookshelf\n\n### Currently Reading\n- \n\n### Want to Read\n- \n\n### Finished\n- ' },
  { name: 'Movies & Series', Icon: IconMovie, category: 'movies', defaultContent: '## Movies & Series\n\n### Watching\n- \n\n### Want to Watch\n- \n\n### Watched\n- ' },
  { name: 'Finance', Icon: IconWallet, category: 'finance', defaultContent: '## Finance Tracker\n\n### Income\n- \n\n### Expenses\n- \n\n### Savings Goals\n- \n\n### Notes\n- ' },
  { name: 'Goals', Icon: IconTarget, category: 'goals', defaultContent: '## Goals\n\n### Short Term Goals\n- [ ] \n\n### Long Term Goals\n- [ ] \n\n### Progress Notes\n- ' },
  { name: 'Vision', Icon: IconVision, category: 'vision', defaultContent: '## Vision Board\n\n### My Vision\n- \n\n### Dreams & Aspirations\n- \n\n### Inspiration\n- ' },
  { name: 'Health', Icon: IconHeart, category: 'health', defaultContent: '## Health Tracker\n\n### Daily Health Log\n- Sleep: hours\n- Water: glasses\n- Exercise: \n- Mood: \n\n### Notes\n- ' },
];

// Quick Quest Categories for dashboard
const quickQuestCategories = [
  { id: 'health', label: 'Kesehatan', icon: '💪', color: 'from-emerald-500/20 to-green-600/20', xp: 25 },
  { id: 'productivity', label: 'Produktivitas', icon: '⚡', color: 'from-blue-500/20 to-cyan-500/20', xp: 50 },
  { id: 'learning', label: 'Pembelajaran', icon: '📚', color: 'from-purple-500/20 to-indigo-500/20', xp: 50 },
  { id: 'creative', label: 'Kreativitas', icon: '🎨', color: 'from-amber-500/20 to-orange-500/20', xp: 25 },
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
    case 'work': 
    case 'productivity': return { bg: 'bg-primary/15', text: 'text-primary', dot: 'bg-primary' };
    case 'health': return { bg: 'bg-destructive/15', text: 'text-destructive', dot: 'bg-destructive' };
    case 'life': 
    case 'social': return { bg: 'bg-secondary/15', text: 'text-secondary', dot: 'bg-secondary' };
    case 'personal':
    case 'creative': return { bg: 'bg-accent/15', text: 'text-accent', dot: 'bg-accent' };
    case 'learning': return { bg: 'bg-success/15', text: 'text-success', dot: 'bg-success' };
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
  const { user } = useAuth();
  const [activeOverviewTab, setActiveOverviewTab] = useState('Todo');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [financeData, setFinanceData] = useState<{ income: number; expenses: number }>({ income: 0, expenses: 0 });
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isNoteSheetOpen, setIsNoteSheetOpen] = useState(false);
  const [isCreatingNote, setIsCreatingNote] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    
    // Fetch finance data for current month
    const startOfCurrentMonth = startOfMonth(new Date()).toISOString();
    const endOfCurrentMonth = endOfMonth(new Date()).toISOString();
    
    const { data: transactions } = await supabase
      .from('finance_transactions')
      .select('*')
      .gte('date', startOfCurrentMonth.split('T')[0])
      .lte('date', endOfCurrentMonth.split('T')[0]);

    if (transactions) {
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      setFinanceData({ income, expenses });
    }

    // Fetch recent notes
    const { data: notesData } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(5);

    if (notesData) setNotes(notesData);
    
    setIsLoading(false);
  };

  const createNoteFromMenu = async (menuItem: QuickMenuItem) => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    setIsCreatingNote(menuItem.name);

    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title: `${menuItem.name} - ${new Date().toLocaleDateString()}`,
        content: menuItem.defaultContent,
        category: menuItem.category,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create note');
    } else if (data) {
      toast.success(`${menuItem.name} note created!`);
      setSelectedNote(data);
      setIsNoteSheetOpen(true);
      fetchDashboardData();
    }
    
    setIsCreatingNote(null);
  };

  const handleQuickMenuClick = (itemName: string) => {
    const menuItem = quickMenuItems.find(item => item.name === itemName);
    if (menuItem) {
      createNoteFromMenu(menuItem);
    }
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

  // Get quests for a specific date
  const getQuestsForDate = (date: Date) => {
    return quests.filter(q => {
      if (!q.dueDate) return false;
      return isSameDay(new Date(q.dueDate), date);
    });
  };

  // Group quests by time period
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);

  const todayQuests = quests.filter(q => !q.completed && q.dueDate && isSameDay(new Date(q.dueDate), today));
  const tomorrowQuests = quests.filter(q => !q.completed && q.dueDate && isSameDay(new Date(q.dueDate), tomorrow));
  const next7DaysQuests = quests.filter(q => {
    if (q.completed || !q.dueDate) return false;
    const dueDate = new Date(q.dueDate);
    return dueDate > tomorrow && dueDate <= nextWeek;
  });

  const activeQuests = quests.filter(q => !q.completed).slice(0, 10);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-8">
      {/* User Profile Card - Mobile First */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-xl md:rounded-2xl p-4 md:p-6 border border-border/50 animate-fade-in">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-display text-lg md:text-xl font-bold shadow-lg">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                profile.name.split(' ').map(n => n[0]).join('').substring(0, 2)
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary flex items-center justify-center text-[10px] md:text-xs font-bold text-primary-foreground border-2 border-background">
              {profile.level}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-foreground text-lg md:text-xl truncate">
              {profile.name}
            </h2>
            <p className="text-muted-foreground text-xs md:text-sm truncate">{profile.title}</p>
            
            {/* XP Progress */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full progress-bar rounded-full transition-all duration-500"
                  style={{ width: `${(profile.currentXP / 1000) * 100}%` }}
                />
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap">
                {profile.currentXP}/1000 XP
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-border/30">
          <div className="text-center">
            <div className="text-lg md:text-xl font-display font-bold text-primary">{stats.questsCompleted}</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Quests</div>
          </div>
          <div className="text-center">
            <div className="text-lg md:text-xl font-display font-bold text-accent">{stats.habitsTracked}</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Habits</div>
          </div>
          <div className="text-center">
            <div className="text-lg md:text-xl font-display font-bold text-success">{stats.goalsAchieved}</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Goals</div>
          </div>
          <div className="text-center">
            <div className="text-lg md:text-xl font-display font-bold text-secondary">{stats.currentStreak}</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Streak</div>
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="space-y-2 px-1 md:px-2 animate-slide-up" style={{ animationDelay: '50ms' }}>
        <h1 className="text-2xl md:text-4xl font-display font-bold text-foreground">
          Life Planner
        </h1>
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 md:h-5 bg-primary rounded-full" />
          <p className="text-muted-foreground text-xs md:text-sm">All your thoughts in one private place.</p>
        </div>
      </div>

      {/* Quick Quest Add Section */}
      <div className="space-y-3 px-1 md:px-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base md:text-lg text-foreground">Tambah Misi Cepat</h2>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('quests')} className="text-xs text-muted-foreground">
            Lihat Semua →
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {quickQuestCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('quests')}
              className={cn(
                "p-3 md:p-4 rounded-lg md:rounded-xl border border-primary/20 bg-gradient-to-br transition-all hover:scale-[1.02] hover:border-primary/40",
                cat.color
              )}
            >
              <div className="text-2xl md:text-3xl mb-2">{cat.icon}</div>
              <p className="text-xs md:text-sm font-display text-foreground">{cat.label}</p>
              <p className="text-[10px] md:text-xs text-primary mt-1">+{cat.xp} XP</p>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Section */}
      <div className="space-y-3 md:space-y-4 px-1 md:px-2 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">—</span>
          <h2 className="font-display text-base md:text-lg text-foreground">Overview</h2>
        </div>

        <div className="flex items-center gap-1 flex-wrap overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
          {overviewTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveOverviewTab(tab.name)}
              className={cn(
                "px-2.5 md:px-3 py-1.5 rounded-md text-xs md:text-sm flex items-center gap-1 md:gap-1.5 transition-colors whitespace-nowrap",
                activeOverviewTab === tab.name
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <tab.Icon className="w-3 h-3 md:w-3.5 md:h-3.5" size={12} />
              {tab.name}
            </button>
          ))}
          <button className="px-2.5 md:px-3 py-1.5 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            3 more...
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Task Table */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50 bg-muted/20">
                    <tr className="text-left text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="p-2 md:p-3 w-8 md:w-10"></th>
                      <th className="p-2 md:p-3 w-6 hidden sm:table-cell">
                        <div className="w-4 h-4 rounded border border-border" />
                      </th>
                      <th className="p-2 md:p-3">
                        <span className="flex items-center gap-1">Name</span>
                      </th>
                      <th className="p-2 md:p-3 hidden md:table-cell">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          Category
                        </span>
                      </th>
                      <th className="p-2 md:p-3 hidden lg:table-cell">
                        <span className="flex items-center gap-1">
                          <IconCalendar className="w-3 h-3" size={12} /> Due
                        </span>
                      </th>
                      <th className="p-2 md:p-3 w-12 md:w-16">
                        <span className="flex items-center gap-1">XP</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeQuests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No tasks yet. Add your first task!
                        </td>
                      </tr>
                    ) : (
                      activeQuests.map((quest) => {
                        const style = getCategoryStyle(quest.category);
                        return (
                          <tr 
                            key={quest.id} 
                            className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                          >
                            <td className="p-3">
                              <Checkbox
                                checked={quest.completed}
                                onCheckedChange={() => onCompleteQuest(quest.id)}
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
                              quest.completed ? "text-muted-foreground line-through" : "text-foreground"
                            )}>
                              {quest.title}
                            </td>
                            <td className="p-3 hidden md:table-cell">
                              <span className={cn(
                                "inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs capitalize",
                                style.bg, style.text
                              )}>
                                <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
                                {quest.category}
                              </span>
                            </td>
                            <td className="p-3 text-xs text-muted-foreground hidden lg:table-cell">
                              {quest.dueDate ? format(new Date(quest.dueDate), 'MMM d, yyyy') : '—'}
                            </td>
                            <td className="p-3">
                              {quest.xpReward >= 50 && (
                                <span className="px-2 py-0.5 rounded text-xs bg-destructive/15 text-destructive font-medium">
                                  {quest.xpReward}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
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
      <div className="grid lg:grid-cols-3 gap-6 px-2 animate-slide-up" style={{ animationDelay: '400ms' }}>
        {/* Calendar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">—</span>
            <h2 className="font-display text-lg text-foreground">Calendar</h2>
          </div>

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

          <Card className="border-border/50">
            <CardContent className="py-5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-lg text-foreground">{monthName}</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs gap-1.5">
                    <IconCalendar className="w-3 h-3" size={12} /> Open in Calendar
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

              <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="py-2 font-medium">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: paddingDays }).map((_, index) => (
                  <div key={`padding-${index}`} className="aspect-square p-1" />
                ))}
                
                {days.map((date) => {
                  const dayQuests = getQuestsForDate(date);
                  const isTodayDate = isToday(date);
                  
                  return (
                    <div
                      key={date.toISOString()}
                      className={cn(
                        "min-h-[80px] p-1 rounded-lg text-sm relative border border-transparent transition-colors",
                        isTodayDate && "bg-primary/10 ring-2 ring-primary",
                        !isTodayDate && "hover:bg-muted/30"
                      )}
                    >
                      <span className={cn(
                        "block text-center mb-1",
                        isTodayDate ? "text-primary font-bold" : "text-muted-foreground"
                      )}>
                        {format(date, 'd')}
                      </span>
                      
                      <div className="space-y-0.5">
                        {dayQuests.slice(0, 3).map((quest) => {
                          const style = getCategoryStyle(quest.category);
                          return (
                            <div 
                              key={quest.id}
                              className={cn(
                                "text-[10px] truncate rounded px-1 py-0.5",
                                style.bg, style.text
                              )}
                            >
                              {quest.title.substring(0, 10)}
                            </div>
                          );
                        })}
                        {dayQuests.length > 3 && (
                          <div className="text-[10px] text-muted-foreground text-center">
                            +{dayQuests.length - 3}
                          </div>
                        )}
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
              <IconCheck className="w-3 h-3" size={12} /> All <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <Card className="border-border/50">
            <CardContent className="py-4 space-y-4">
              {/* Today */}
              <div>
                <button className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <ChevronDown className="w-3 h-3" />
                  <span className="text-primary">Today</span>
                  <span className="text-xs">{todayQuests.length}</span>
                </button>
                <div className="space-y-2 pl-4">
                  {todayQuests.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No tasks for today</p>
                  ) : (
                    todayQuests.slice(0, 3).map((quest) => (
                      <div key={quest.id} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full border-2 border-primary" />
                        <span className="text-sm text-foreground flex-1 truncate">{quest.title}</span>
                        {quest.xpReward >= 50 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-destructive/15 text-destructive">
                            High
                          </span>
                        )}
                        <Checkbox 
                          className="w-4 h-4" 
                          checked={quest.completed}
                          onCheckedChange={() => onCompleteQuest(quest.id)}
                        />
                      </div>
                    ))
                  )}
                  <button 
                    onClick={() => onNavigate('quests')}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> New
                  </button>
                </div>
              </div>

              {/* Tomorrow */}
              <div>
                <button className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <ChevronDown className="w-3 h-3" />
                  <span className="text-primary">Tomorrow</span>
                  <span className="text-xs">{tomorrowQuests.length}</span>
                </button>
                <div className="space-y-2 pl-4">
                  {tomorrowQuests.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No tasks for tomorrow</p>
                  ) : (
                    tomorrowQuests.slice(0, 3).map((quest) => (
                      <div key={quest.id} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full border-2 border-secondary" />
                        <span className="text-sm text-foreground flex-1 truncate">{quest.title}</span>
                        {quest.xpReward >= 50 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-destructive/15 text-destructive">
                            High
                          </span>
                        )}
                        <Checkbox 
                          className="w-4 h-4"
                          checked={quest.completed}
                          onCheckedChange={() => onCompleteQuest(quest.id)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Next 7 days */}
              <div>
                <button className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <ChevronDown className="w-3 h-3" />
                  <span className="text-primary">Next 7 days</span>
                  <span className="text-xs">{next7DaysQuests.length}</span>
                </button>
                <div className="space-y-2 pl-4">
                  {next7DaysQuests.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No upcoming tasks</p>
                  ) : (
                    next7DaysQuests.slice(0, 5).map((quest) => (
                      <div key={quest.id} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full border-2 border-muted-foreground" />
                        <span className="text-sm text-foreground flex-1 truncate">{quest.title}</span>
                        {quest.xpReward >= 50 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-destructive/15 text-destructive">
                            High
                          </span>
                        )}
                        <Checkbox 
                          className="w-4 h-4"
                          checked={quest.completed}
                          onCheckedChange={() => onCompleteQuest(quest.id)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2 animate-slide-up" style={{ animationDelay: '500ms' }}>
        {/* Habit Tracker */}
        <Card className="border-border/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">—</span>
                <h3 className="font-display text-sm text-foreground">Habit Tracker</h3>
              </div>
              <button className="flex items-center gap-1 text-xs text-muted-foreground">
                <IconCalendar className="w-3 h-3" size={12} /> Today <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-3 h-3 rounded-full border-2 border-destructive" />
                <span className="text-sm">{format(new Date(), 'EEEE')}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {habits.filter(h => h.completedToday).length}/{habits.length} completed
              </div>
              
              <div className="space-y-2">
                {habits.slice(0, 5).map((habit) => (
                  <div key={habit.id} className="flex items-center gap-2 text-sm">
                    <Checkbox 
                      className="w-4 h-4"
                      checked={habit.completedToday}
                      onCheckedChange={() => onCompleteHabit(habit.id)}
                    />
                    <IconHabits className="w-3 h-3 text-muted-foreground" size={12} />
                    <span className={cn(
                      "text-muted-foreground",
                      habit.completedToday && "line-through"
                    )}>
                      {habit.name}
                    </span>
                  </div>
                ))}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2 text-xs"
                onClick={() => onNavigate('habits')}
              >
                <Plus className="w-3 h-3 mr-1" /> New
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card className="border-border/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">—</span>
                <h3 className="font-display text-sm text-foreground">Goals</h3>
              </div>
              <button className="flex items-center gap-1 text-xs text-muted-foreground">
                <IconTarget className="w-3 h-3" size={12} /> Active <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-3">
              {goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground truncate">{goal.title}</span>
                    <span className="text-xs text-muted-foreground">{goal.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
              
              {goals.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">No active goals</p>
              )}

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2 text-xs"
                onClick={() => onNavigate('goals')}
              >
                <Plus className="w-3 h-3 mr-1" /> New Goal
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notes */}
        <Card className="border-border/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">—</span>
                <h3 className="font-display text-sm text-foreground">Recent Notes</h3>
              </div>
              <button className="flex items-center gap-1 text-xs text-muted-foreground">
                <IconJournal className="w-3 h-3" size={12} /> All <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-2">
              {notes.slice(0, 4).map((note) => (
                <button
                  key={note.id}
                  onClick={() => onNavigate('notes')}
                  className="flex items-center gap-2 text-sm w-full text-left hover:bg-muted/30 rounded p-1 -m-1 transition-colors"
                >
                  <span className="text-muted-foreground">-</span>
                  <span className="text-foreground truncate flex-1">{note.title}</span>
                </button>
              ))}
              
              {notes.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">No notes yet</p>
              )}
              
              <button 
                onClick={() => onNavigate('notes')}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mt-2"
              >
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
                <IconCalendar className="w-3 h-3" size={12} /> This month <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <IconCalendar className="w-3 h-3" size={12} /> {format(new Date(), 'yyyy MMMM')}
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Income</span>
                  <span className="text-success">${financeData.income.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Expenses</span>
                  <span className="text-destructive">${financeData.expenses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border/50">
                  <span className="text-muted-foreground">Balance</span>
                  <span className={cn(
                    "font-medium",
                    financeData.income - financeData.expenses >= 0 ? "text-success" : "text-destructive"
                  )}>
                    ${(financeData.income - financeData.expenses).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => onNavigate('finance')}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prayer Times Widget */}
      <div className="px-2 animate-slide-up" style={{ animationDelay: '600ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-muted-foreground">—</span>
          <h2 className="font-display text-lg text-foreground">Prayer Times</h2>
        </div>
        <PrayerTimesWidget />
      </div>

      {/* Note Detail Sheet */}
      <NoteDetailSheet
        note={selectedNote}
        open={isNoteSheetOpen}
        onOpenChange={setIsNoteSheetOpen}
        onDelete={async (id) => {
          await supabase.from('notes').delete().eq('id', id);
          fetchDashboardData();
          setIsNoteSheetOpen(false);
        }}
        onTogglePin={async (note) => {
          await supabase.from('notes').update({ is_pinned: !note.is_pinned }).eq('id', note.id);
          fetchDashboardData();
        }}
        onNoteUpdated={fetchDashboardData}
      />
    </div>
  );
};