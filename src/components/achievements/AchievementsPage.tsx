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
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <Trophy className="w-8 h-8 text-accent" />
            Achievements
          </h1>
          <p className="text-muted-foreground font-body mt-1">
            Unlock achievements by completing challenges
          </p>
        </div>
        <div className="card-gaming rounded-lg px-4 py-3">
          <span className="text-2xl font-display text-accent">{unlockedCount}</span>
          <span className="text-sm text-muted-foreground font-body"> / {achievements.length} Unlocked</span>
        </div>
      </div>

      {/* Rarity Legend */}
      <div className="flex flex-wrap gap-4">
        {(['common', 'rare', 'epic', 'legendary'] as const).map(rarity => (
          <div key={rarity} className="flex items-center gap-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              rarityColors[rarity].bg,
              rarityColors[rarity].glow
            )} />
            <span className="text-sm font-body text-muted-foreground capitalize">{rarity}</span>
          </div>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => {
          const colors = rarityColors[achievement.rarity];
          
          return (
            <div
              key={achievement.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className={cn(
                "card-gaming rounded-xl p-5 transition-all duration-300 border-2 animate-slide-up",
                achievement.unlocked
                  ? `${colors.border} ${colors.glow} hover:scale-[1.02]`
                  : "border-border opacity-50"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center text-2xl",
                  achievement.unlocked ? colors.bg : "bg-muted"
                )}>
                  {achievement.unlocked ? (
                    achievement.icon
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={cn(
                      "font-display text-lg",
                      achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {achievement.title}
                    </h3>
                    {achievement.rarity === 'legendary' && achievement.unlocked && (
                      <Star className="w-4 h-4 text-accent fill-accent" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-body mt-1">
                    {achievement.description}
                  </p>
                  <div className="mt-2">
                    <span className={cn(
                      "text-xs font-body uppercase tracking-wider px-2 py-0.5 rounded-full",
                      colors.bg,
                      colors.text
                    )}>
                      {achievement.rarity}
                    </span>
                  </div>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-muted-foreground font-body mt-2">
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
