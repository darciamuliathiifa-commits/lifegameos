import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';

interface Note {
  id: string;
  title: string;
  content: string | null;
  category: string;
  created_at: string;
}

interface Quest {
  id: string;
  title: string;
  category: string;
  created_at: string;
  completed: boolean;
}

interface CalendarWithNotesProps {
  onDayClick?: (date: Date, items: { notes: Note[]; quests: Quest[] }) => void;
}

export const CalendarWithNotes = ({ onDayClick }: CalendarWithNotesProps) => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, currentMonth]);

  const fetchData = async () => {
    const startDate = startOfMonth(currentMonth);
    const endDate = endOfMonth(currentMonth);

    // Fetch notes
    const { data: notesData } = await supabase
      .from('notes')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    if (notesData) setNotes(notesData);

    // Fetch quests
    const { data: questsData } = await supabase
      .from('quests')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    if (questsData) setQuests(questsData);
  };

  const getItemsForDate = (date: Date) => {
    const dayNotes = notes.filter(note => isSameDay(new Date(note.created_at), date));
    const dayQuests = quests.filter(quest => isSameDay(new Date(quest.created_at), date));
    return { notes: dayNotes, quests: dayQuests };
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    // Get the day of week for the first day (0 = Sunday, we want Monday = 0)
    const startDayOfWeek = getDay(start);
    const paddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    
    return { days, paddingDays };
  };

  const { days, paddingDays } = getDaysInMonth();
  const monthName = format(currentMonth, 'MMMM yyyy');

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    const items = getItemsForDate(date);
    onDayClick?.(date, items);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      planner: 'bg-blue-500',
      meal: 'bg-orange-500',
      bookshelf: 'bg-purple-500',
      goals: 'bg-emerald-500',
      habits: 'bg-pink-500',
      travel: 'bg-cyan-500',
      movies: 'bg-red-500',
      vision: 'bg-indigo-500',
      journal: 'bg-amber-500',
      workout: 'bg-rose-500',
      finance: 'bg-green-500',
      health: 'bg-teal-500',
      general: 'bg-gray-500',
      productivity: 'bg-primary',
      learning: 'bg-secondary',
    };
    return colors[category] || 'bg-primary';
  };

  return (
    <Card className="border-border/50">
      <CardContent className="py-5">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-lg text-foreground">{monthName}</span>
          <div className="flex items-center gap-2">
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

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground font-body mb-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="py-2 font-medium">{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Padding for days before the 1st */}
          {Array.from({ length: paddingDays }).map((_, index) => (
            <div key={`padding-${index}`} className="aspect-square" />
          ))}
          
          {/* Actual days */}
          {days.map((date) => {
            const items = getItemsForDate(date);
            const hasItems = items.notes.length > 0 || items.quests.length > 0;
            const isToday = isSameDay(date, new Date());
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            
            // Get unique categories for indicators
            const categories = [...new Set([
              ...items.notes.map(n => n.category),
              ...items.quests.map(q => q.category)
            ])].slice(0, 3);
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDayClick(date)}
                className={cn(
                  "aspect-square p-1 rounded-lg text-center font-body text-sm relative flex flex-col items-center justify-center transition-all",
                  "hover:bg-muted/50 cursor-pointer",
                  isToday && "bg-primary/20 text-primary font-bold ring-1 ring-primary/50",
                  isSelected && !isToday && "bg-secondary/20 ring-1 ring-secondary/50",
                  hasItems && "font-medium"
                )}
              >
                <span>{format(date, 'd')}</span>
                
                {/* Category indicators */}
                {hasItems && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {categories.map((category, idx) => (
                      <div 
                        key={idx} 
                        className={cn("w-1.5 h-1.5 rounded-full", getCategoryColor(category))} 
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Date Info */}
        {selectedDate && (
          <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-sm font-display text-foreground mb-2">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
            {(() => {
              const items = getItemsForDate(selectedDate);
              const totalItems = items.notes.length + items.quests.length;
              
              if (totalItems === 0) {
                return <p className="text-xs text-muted-foreground">No items on this day</p>;
              }
              
              return (
                <div className="space-y-1">
                  {items.notes.slice(0, 3).map(note => (
                    <div key={note.id} className="flex items-center gap-2 text-xs">
                      <FileText className="w-3 h-3 text-primary" />
                      <span className="text-foreground/80 truncate">{note.title}</span>
                    </div>
                  ))}
                  {items.quests.slice(0, 2).map(quest => (
                    <div key={quest.id} className="flex items-center gap-2 text-xs">
                      <div className={cn("w-3 h-3 rounded", quest.completed ? "bg-primary" : "border border-border")} />
                      <span className={cn("text-foreground/80 truncate", quest.completed && "line-through")}>{quest.title}</span>
                    </div>
                  ))}
                  {totalItems > 5 && (
                    <p className="text-xs text-muted-foreground">+{totalItems - 5} more</p>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
