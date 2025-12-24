import { Bell, Search } from 'lucide-react';
import { UserProfile, XP_PER_LEVEL } from '@/types/game';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  profile: UserProfile;
}

export const Header = ({ profile }: HeaderProps) => {
  const xpProgress = (profile.currentXP / XP_PER_LEVEL) * 100;

  return (
    <header className="fixed top-0 left-20 lg:left-64 right-0 z-30 h-16 bg-background/90 backdrop-blur-xl border-b border-border px-4 lg:px-6 flex items-center justify-between">
      {/* Search */}
      <div className="hidden md:flex items-center gap-2.5 bg-muted/50 border border-border/50 rounded-lg px-3.5 py-2 w-72 lg:w-80 transition-all focus-within:border-primary/50 focus-within:bg-muted/70">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search quests, habits, goals..."
          className="bg-transparent border-none outline-none text-sm font-body text-foreground placeholder:text-muted-foreground/70 w-full"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 lg:gap-6 ml-auto">
        {/* XP Bar */}
        <div className="hidden lg:flex flex-col items-end gap-1 min-w-44">
          <div className="flex items-center gap-2">
            <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">
              Level {profile.level}
            </span>
            <span className="text-xs font-display text-primary">
              {profile.currentXP} / {XP_PER_LEVEL} XP
            </span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full xp-bar rounded-full transition-all duration-500 shadow-[0_0_8px_hsl(var(--primary)/0.5)]"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full shadow-[0_0_6px_hsl(var(--destructive))]" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 border-2 border-primary/50 shadow-[0_0_12px_hsl(var(--primary)/0.3)]">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="bg-primary text-primary-foreground font-display text-xs">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-display text-foreground leading-tight">{profile.name}</p>
            <p className="text-xs font-body text-primary leading-tight">{profile.title}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
