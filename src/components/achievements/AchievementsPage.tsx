import { Trophy, Lock, Star } from 'lucide-react';
import { Achievement } from '@/types/game';
import { cn } from '@/lib/utils';

interface AchievementsPageProps {
  achievements: Achievement[];
}

const rarityColors = {
  common: {
    bg: 'bg-muted',
    border: 'border-muted-foreground/30',
    text: 'text-muted-foreground',
    glow: '',
  },
  rare: {
    bg: 'bg-primary/20',
    border: 'border-primary/50',
    text: 'text-primary',
    glow: 'shadow-[0_0_15px_hsl(var(--primary)/0.3)]',
  },
  epic: {
    bg: 'bg-secondary/20',
    border: 'border-secondary/50',
    text: 'text-secondary',
    glow: 'shadow-[0_0_20px_hsl(var(--secondary)/0.4)]',
  },
  legendary: {
    bg: 'bg-accent/20',
    border: 'border-accent/50',
    text: 'text-accent',
    glow: 'shadow-[0_0_25px_hsl(var(--accent)/0.5)]',
  },
};

export const AchievementsPage = ({ achievements }: AchievementsPageProps) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-4 md:space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-display text-foreground flex items-center gap-2 md:gap-3">
            <Trophy className="w-6 h-6 md:w-8 md:h-8 text-accent" />
            Achievements
          </h1>
          <p className="text-muted-foreground font-body text-xs md:text-sm mt-1">
            Unlock achievements by completing challenges
          </p>
        </div>
        <div className="card-gaming rounded-lg px-3 py-2 md:px-4 md:py-3 w-fit">
          <span className="text-lg md:text-2xl font-display text-accent">{unlockedCount}</span>
          <span className="text-xs md:text-sm text-muted-foreground font-body"> / {achievements.length} Unlocked</span>
        </div>
      </div>

      {/* Rarity Legend */}
      <div className="flex flex-wrap gap-2 md:gap-4">
        {(['common', 'rare', 'epic', 'legendary'] as const).map(rarity => (
          <div key={rarity} className="flex items-center gap-1.5 md:gap-2">
            <div className={cn(
              "w-2 h-2 md:w-3 md:h-3 rounded-full",
              rarityColors[rarity].bg,
              rarityColors[rarity].glow
            )} />
            <span className="text-xs md:text-sm font-body text-muted-foreground capitalize">{rarity}</span>
          </div>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {achievements.map((achievement, index) => {
          const colors = rarityColors[achievement.rarity];
          
          return (
            <div
              key={achievement.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className={cn(
                "card-gaming rounded-lg md:rounded-xl p-3 md:p-5 transition-all duration-300 border-2 animate-slide-up",
                achievement.unlocked
                  ? `${colors.border} ${colors.glow} hover:scale-[1.02]`
                  : "border-border opacity-50"
              )}
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className={cn(
                  "w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center text-lg md:text-2xl flex-shrink-0",
                  achievement.unlocked ? colors.bg : "bg-muted"
                )}>
                  {achievement.unlocked ? (
                    achievement.icon
                  ) : (
                    <Lock className="w-4 h-4 md:w-6 md:h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <h3 className={cn(
                      "font-display text-sm md:text-lg truncate",
                      achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {achievement.title}
                    </h3>
                    {achievement.rarity === 'legendary' && achievement.unlocked && (
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-accent fill-accent flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground font-body mt-0.5 md:mt-1 line-clamp-2">
                    {achievement.description}
                  </p>
                  <div className="mt-1.5 md:mt-2">
                    <span className={cn(
                      "text-[10px] md:text-xs font-body uppercase tracking-wider px-1.5 md:px-2 py-0.5 rounded-full",
                      colors.bg,
                      colors.text
                    )}>
                      {achievement.rarity}
                    </span>
                  </div>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-[10px] md:text-xs text-muted-foreground font-body mt-1.5 md:mt-2">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
