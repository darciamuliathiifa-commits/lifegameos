import { Check, Zap, Clock, Image as ImageIcon } from 'lucide-react';
import { Quest } from '@/types/game';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { cn } from '@/lib/utils';

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => void;
  onImageUpload?: (id: string, image: string) => void;
  showImageUpload?: boolean;
}

export const QuestCard = ({ 
  quest, 
  onComplete, 
  onImageUpload,
  showImageUpload = false 
}: QuestCardProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(quest.id, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={cn(
      "card-gaming rounded-xl p-5 transition-all duration-300 hover:shadow-[0_0_25px_hsl(var(--primary)/0.3)] group",
      quest.completed && "opacity-60"
    )}>
      <div className="flex gap-4">
        {/* Image Section */}
        {(quest.image || showImageUpload) && (
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
            {quest.image ? (
              <img src={quest.image} alt={quest.title} className="w-full h-full object-cover" />
            ) : (
              <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CategoryBadge category={quest.category} />
                {quest.dueDate && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {new Date(quest.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <h3 className={cn(
                "font-display text-lg text-foreground",
                quest.completed && "line-through"
              )}>
                {quest.title}
              </h3>
              <p className="text-sm text-muted-foreground font-body mt-1 line-clamp-2">
                {quest.description}
              </p>
            </div>

            {/* XP Reward */}
            <div className="flex items-center gap-1 text-accent shrink-0">
              <Zap className="w-4 h-4" />
              <span className="font-display text-sm">+{quest.xpReward}</span>
            </div>
          </div>

          {/* Action */}
          <div className="mt-4 flex items-center gap-3">
            {!quest.completed ? (
              <Button
                variant="gaming"
                size="sm"
                onClick={() => onComplete(quest.id)}
                className="gap-2"
              >
                <Check className="w-4 h-4" />
                Complete Quest
              </Button>
            ) : (
              <span className="flex items-center gap-2 text-success font-body text-sm">
                <Check className="w-4 h-4" />
                Completed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
