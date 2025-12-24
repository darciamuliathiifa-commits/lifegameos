import { useState } from 'react';
import { Plus, Flame, Trophy } from 'lucide-react';
import { Habit, Category } from '@/types/game';
import { Button } from '@/components/ui/button';
import { HabitCard } from './HabitCard';
import { AddHabitDialog } from './AddHabitDialog';

interface HabitsPageProps {
  habits: Habit[];
  onComplete: (id: string) => void;
  onAdd: (habit: Omit<Habit, 'id' | 'streak' | 'completedToday'>) => void;
  onDelete: (id: string) => void;
  onImageUpload: (id: string, image: string) => void;
}

export const HabitsPage = ({ 
  habits, 
  onComplete, 
  onAdd, 
  onDelete,
  onImageUpload 
}: HabitsPageProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const completedToday = habits.filter(h => h.completedToday).length;
  const longestStreak = Math.max(...habits.map(h => h.streak), 0);
  const totalStreakDays = habits.reduce((sum, h) => sum + h.streak, 0);

  return (
    <div className="space-y-4 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between md:gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-display text-foreground flex items-center gap-2 md:gap-3">
            <Flame className="w-6 h-6 md:w-8 md:h-8 text-accent" />
            Habit Tracker
          </h1>
          <p className="text-muted-foreground font-body text-xs md:text-base mt-1">
            Build consistency and maintain your streaks
          </p>
        </div>
        <Button variant="gaming" onClick={() => setIsDialogOpen(true)} className="gap-2 w-full md:w-auto">
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          New Habit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <div className="card-gaming rounded-lg md:rounded-xl p-3 md:p-5 text-center">
          <div className="text-xl md:text-3xl font-display text-primary">{completedToday}/{habits.length}</div>
          <div className="text-[10px] md:text-sm text-muted-foreground font-body mt-1">Progress</div>
        </div>
        <div className="card-gaming rounded-lg md:rounded-xl p-3 md:p-5 text-center">
          <div className="flex items-center justify-center gap-1 md:gap-2 text-xl md:text-3xl font-display text-accent">
            <Flame className="w-4 h-4 md:w-6 md:h-6" />
            {longestStreak}
          </div>
          <div className="text-[10px] md:text-sm text-muted-foreground font-body mt-1">Best Streak</div>
        </div>
        <div className="card-gaming rounded-lg md:rounded-xl p-3 md:p-5 text-center">
          <div className="flex items-center justify-center gap-1 md:gap-2 text-xl md:text-3xl font-display text-success">
            <Trophy className="w-4 h-4 md:w-6 md:h-6" />
            {totalStreakDays}
          </div>
          <div className="text-[10px] md:text-sm text-muted-foreground font-body mt-1">Total Days</div>
        </div>
      </div>

      {/* Habit List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {habits.map((habit, index) => (
          <div 
            key={habit.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="animate-slide-up"
          >
            <HabitCard 
              habit={habit} 
              onComplete={onComplete}
              onImageUpload={onImageUpload}
              showImageUpload
            />
          </div>
        ))}
      </div>

      {habits.length === 0 && (
        <div className="card-gaming rounded-xl p-12 text-center">
          <Flame className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-body text-lg">No habits yet</p>
          <p className="text-muted-foreground font-body text-sm mt-1">
            Start building your daily routine!
          </p>
        </div>
      )}

      <AddHabitDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onAdd={onAdd}
      />
    </div>
  );
};
