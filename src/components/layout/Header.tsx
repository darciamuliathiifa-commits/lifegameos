import { Bell, Search, LogOut, Menu } from 'lucide-react';
import { UserProfile, XP_PER_LEVEL } from '@/types/game';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  profile: UserProfile;
}

export const Header = ({ profile }: HeaderProps) => {
  const xpProgress = (profile.currentXP / XP_PER_LEVEL) * 100;
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 z-30 h-16 bg-card/90 backdrop-blur-xl border-b border-border/50 px-4 lg:px-6 flex items-center justify-between shadow-sm">
      {/* Spacer for mobile menu button */}
      <div className="w-12 lg:hidden" />

      {/* Search */}
      <div className="hidden md:flex items-center gap-2.5 bg-muted/70 border border-primary/20 rounded-2xl px-4 py-2.5 w-72 lg:w-80 transition-all focus-within:border-primary/50 focus-within:bg-card focus-within:shadow-md">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search your adventure..."
          className="bg-transparent border-none outline-none text-sm font-body text-foreground placeholder:text-muted-foreground/60 w-full"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 lg:gap-5 ml-auto">
        {/* XP Bar */}
        <div className="hidden lg:flex flex-col items-end gap-1.5 min-w-44">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-secondary/25 to-secondary/15 border border-secondary/40 shadow-sm">
              <span className="text-xs">⭐</span>
              <span className="text-xs font-display font-semibold text-secondary">
                Lv. {profile.level}
              </span>
            </div>
            <span className="text-xs font-body font-semibold text-muted-foreground">
              {profile.currentXP} / {XP_PER_LEVEL} XP
            </span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden border border-secondary/20 shadow-inner">
            <div
              className="h-full xp-bar rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-muted/60 transition-colors border border-transparent hover:border-primary/20">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive rounded-full shadow-md animate-pulse" />
        </button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 outline-none p-1.5 rounded-xl hover:bg-muted/40 transition-colors">
              <Avatar className="w-10 h-10 border-2 border-primary/50 shadow-md ring-2 ring-secondary/30">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground font-display text-sm font-bold">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-display font-semibold text-foreground leading-tight">{profile.name}</p>
                <p className="text-xs font-body text-secondary font-semibold leading-tight">{profile.title}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer rounded-lg">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};