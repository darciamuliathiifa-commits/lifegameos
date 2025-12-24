import { useState } from 'react';
import { Plus, TrendingUp, Zap, Calendar } from 'lucide-react';
import { Goal, Category } from '@/types/game';
import { Button } from '@/components/ui/button';
import { GoalCard } from './GoalCard';
import { AddGoalDialog } from './AddGoalDialog';

interface GoalsPageProps {
  goals: Goal[];
  onAdd: (goal: Omit<Goal, 'id' | 'progress'>) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onDelete: (id: string) => void;
  onImageUpload: (id: string, image: string) => void;
}

export const GoalsPage = ({ 
  goals, 
  onAdd, 
  onUpdateProgress, 
  onDelete,
  onImageUpload 
}: GoalsPageProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const activeGoals = goals.filter(g => g.progress < g.target);
  const completedGoals = goals.filter(g => g.progress >= g.target);
  const totalXPPotential = goals.reduce((sum, g) => sum + g.xpReward, 0);

  return (
    <div className="space-y-4 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between md:gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-display text-foreground flex items-center gap-2 md:gap-3">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-success" />
            Goals
          </h1>
          <p className="text-muted-foreground font-body text-xs md:text-base mt-1">
            Set ambitious goals and track your progress
          </p>
        </div>
        <Button variant="gaming" onClick={() => setIsDialogOpen(true)} className="gap-2 w-full md:w-auto">
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          New Goal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <div className="card-gaming rounded-lg md:rounded-xl p-3 md:p-5 text-center">
          <div className="text-xl md:text-3xl font-display text-primary">{activeGoals.length}</div>
          <div className="text-[10px] md:text-sm text-muted-foreground font-body mt-1">Active</div>
        </div>
        <div className="card-gaming rounded-lg md:rounded-xl p-3 md:p-5 text-center">
          <div className="text-xl md:text-3xl font-display text-success">{completedGoals.length}</div>
          <div className="text-[10px] md:text-sm text-muted-foreground font-body mt-1">Done</div>
        </div>
        <div className="card-gaming rounded-lg md:rounded-xl p-3 md:p-5 text-center">
          <div className="flex items-center justify-center gap-1 md:gap-2 text-xl md:text-3xl font-display text-accent">
            <Zap className="w-4 h-4 md:w-6 md:h-6" />
            {totalXPPotential >= 1000 ? `${(totalXPPotential / 1000).toFixed(1)}k` : totalXPPotential}
          </div>
          <div className="text-[10px] md:text-sm text-muted-foreground font-body mt-1">XP</div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4 md:space-y-6">
        {activeGoals.length > 0 && (
          <div>
            <h2 className="font-display text-base md:text-lg text-foreground mb-3 md:mb-4">Active Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {activeGoals.map((goal, index) => (
                <div 
                  key={goal.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-slide-up"
                >
                  <GoalCard 
                    goal={goal} 
                    onUpdateProgress={onUpdateProgress}
                    onImageUpload={onImageUpload}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {completedGoals.length > 0 && (
          <div>
            <h2 className="font-display text-base md:text-lg text-foreground mb-3 md:mb-4">Completed Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {completedGoals.map((goal, index) => (
                <div 
                  key={goal.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-slide-up opacity-60"
                >
                  <GoalCard 
                    goal={goal} 
                    onUpdateProgress={onUpdateProgress}
                    onImageUpload={onImageUpload}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {goals.length === 0 && (
        <div className="card-gaming rounded-xl p-12 text-center">
          <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-body text-lg">No goals yet</p>
          <p className="text-muted-foreground font-body text-sm mt-1">
            Set your first goal to start tracking!
          </p>
        </div>
      )}

      <AddGoalDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onAdd={onAdd}
      />
    </div>
  );
};
