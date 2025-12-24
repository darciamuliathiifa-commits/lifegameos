import { useState } from 'react';
import { Zap, Calendar, Plus, Minus, Image as ImageIcon, Trophy } from 'lucide-react';
import { Goal } from '@/types/game';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  goal: Goal;
  onUpdateProgress: (id: string, progress: number) => void;
  onImageUpload?: (id: string, image: string) => void;
}

export const GoalCard = ({ goal, onUpdateProgress, onImageUpload }: GoalCardProps) => {
  const progress = (goal.progress / goal.target) * 100;
  const isCompleted = goal.progress >= goal.target;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(goal.id, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={cn(
      "card-gaming rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_hsl(var(--primary)/0.3)]",
      isCompleted && "ring-2 ring-success shadow-[0_0_20px_hsl(var(--success)/0.3)]"
    )}>
      {/* Image Header */}
      {(goal.image || onImageUpload) && (
        <div className="relative h-32 bg-muted">
          {goal.image ? (
            <img src={goal.image} alt={goal.title} className="w-full h-full object-cover" />
          ) : (
            <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
              <div className="text-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <span className="text-xs text-muted-foreground font-body">Add cover image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
          {isCompleted && (
            <div className="absolute inset-0 bg-success/20 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-success drop-shadow-[0_0_10px_hsl(var(--success))]" />
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <CategoryBadge category={goal.category} size="sm" />
            <h3 className="font-display text-lg text-foreground mt-2">{goal.title}</h3>
            <p className="text-sm text-muted-foreground font-body">{goal.description}</p>
          </div>
          <div className="flex items-center gap-1 text-accent shrink-0">
            <Zap className="w-4 h-4" />
            <span className="font-display text-sm">+{goal.xpReward}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-body">Progress</span>
            <span className="text-primary font-display">{goal.progress} / {goal.target}</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isCompleted 
                  ? "bg-success shadow-[0_0_10px_hsl(var(--success)/0.5)]" 
                  : "bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
              )}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span className="font-body">Due: {new Date(goal.deadline).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Progress Controls */}
        {!isCompleted && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUpdateProgress(goal.id, Math.max(0, goal.progress - 1))}
              disabled={goal.progress <= 0}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="flex-1 text-center">
              <span className="font-display text-lg text-foreground">{goal.progress}</span>
              <span className="text-muted-foreground font-body"> / {goal.target}</span>
            </div>
            <Button
              variant="gaming"
              size="icon"
              onClick={() => onUpdateProgress(goal.id, goal.progress + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
