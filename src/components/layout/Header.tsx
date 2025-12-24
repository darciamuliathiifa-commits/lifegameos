import { Bell, Search, LogOut, Home, ChevronRight } from 'lucide-react';
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
    <header className="fixed top-0 left-0 lg:left-64 right-0 z-30 h-16 bg-card/80 backdrop-blur-xl border-b border-border px-4 lg:px-6 flex items-center justify-between">
      {/* Spacer for mobile menu button */}
      <div className="w-12 lg:hidden" />

      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-sm">
        <Home className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">Overview</span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-foreground font-medium">Dashboard</span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 lg:gap-4 ml-auto">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-3 py-2 w-52 transition-all focus-within:border-primary/50 focus-within:bg-card">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm font-body text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>

        {/* XP Bar */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-primary">Lv.{profile.level}</span>
            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full progress-bar rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">
              {profile.currentXP}/{XP_PER_LEVEL}
            </span>
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted/60 transition-colors border border-transparent hover:border-border">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 outline-none p-1.5 rounded-lg hover:bg-muted/40 transition-colors">
              <Avatar className="w-8 h-8 border border-border">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-display text-xs font-semibold">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground leading-tight">{profile.name}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{profile.title}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};