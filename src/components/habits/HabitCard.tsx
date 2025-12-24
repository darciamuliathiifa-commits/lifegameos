import { Check, Flame, Repeat, Zap } from 'lucide-react';
import { Habit, REPEAT_LABELS, RepeatFrequency, DIFFICULTY_LABELS, Difficulty } from '@/types/game';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onImageUpload?: (id: string, image: string) => void;
  compact?: boolean;
  showImageUpload?: boolean;
}

const difficultyColors: Record<Difficulty, string> = {
  easy: 'bg-green-500/20 text-green-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  hard: 'bg-red-500/20 text-red-400',
  very_hard: 'bg-purple-500/20 text-purple-400',
};

export const HabitCard = ({ 
  habit, 
  onComplete, 
  onImageUpload,
  compact = false,
  showImageUpload = false
}: HabitCardProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(habit.id, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const difficulty = habit.difficulty || 'medium';
  const xpReward = habit.xpReward || 25;

  if (compact) {
    return (
      <button
        onClick={() => !habit.completedToday && onComplete(habit.id)}
        disabled={habit.completedToday}
        className={cn(
          "card-gaming rounded-xl p-4 w-full text-left transition-all duration-300 group",
          habit.completedToday
            ? "opacity-60"
            : "hover:shadow-[0_0_25px_hsl(var(--primary)/0.3)] hover:scale-[1.02]"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all",
            habit.completedToday
              ? "bg-success/20"
              : "bg-primary/20 group-hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)]"
          )}>
            {habit.completedToday ? <Check className="w-5 h-5 text-success" /> : habit.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "font-display text-sm text-foreground truncate",
              habit.completedToday && "line-through"
            )}>
              {habit.name}
            </p>
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <div className="flex items-center gap-1 text-accent">
                <Flame className="w-3 h-3" />
                <span className="font-body">{habit.streak} hari</span>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Zap className="w-3 h-3" />
                <span className="font-body">+{xpReward} XP</span>
              </div>
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className={cn(
      "card-gaming rounded-xl p-5 transition-all duration-300 hover:shadow-[0_0_25px_hsl(var(--primary)/0.3)]",
      habit.completedToday && "opacity-60"
    )}>
      <div className="flex gap-4">
        {/* Image or Icon */}
        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
          {habit.image ? (
            <img src={habit.image} alt={habit.name} className="w-full h-full object-cover" />
          ) : showImageUpload ? (
            <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors text-2xl">
              {habit.icon}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              {habit.icon}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CategoryBadge category={habit.category} size="sm" />
                <Badge variant="outline" className={cn("text-xs", difficultyColors[difficulty])}>
                  +{xpReward} XP
                </Badge>
              </div>
              <h3 className={cn(
                "font-display text-lg text-foreground mt-1",
                habit.completedToday && "line-through"
              )}>
                {habit.name}
              </h3>
              {habit.repeatFrequency && (
                <Badge variant="outline" className="text-xs mt-1 inline-flex">
                  <Repeat className="w-3 h-3 mr-1" />
                  {REPEAT_LABELS[habit.repeatFrequency as RepeatFrequency]}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-accent">
              <Flame className="w-4 h-4" />
              <span className="font-display text-lg">{habit.streak}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            {!habit.completedToday ? (
              <Button
                variant="gaming"
                size="sm"
                onClick={() => onComplete(habit.id)}
                className="gap-2"
              >
                <Check className="w-4 h-4" />
                Selesai (+{xpReward} XP)
              </Button>
            ) : (
              <span className="flex items-center gap-2 text-success font-body text-sm">
                <Check className="w-4 h-4" />
                Selesai hari ini! +{xpReward} XP
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
