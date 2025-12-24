import { Home, Target, Zap, Trophy, User, Settings, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'quests', label: 'Quests', icon: Target },
  { id: 'habits', label: 'Habits', icon: Flame },
  { id: 'goals', label: 'Goals', icon: Zap },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'profile', label: 'Profile', icon: User },
];

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-20 lg:w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="hidden lg:block font-display text-lg text-foreground">
            LIFE<span className="text-primary">GAME</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 lg:px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group",
                isActive
                  ? "bg-primary/20 text-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-all duration-300",
                isActive && "drop-shadow-[0_0_8px_hsl(var(--primary))]"
              )} />
              <span className="hidden lg:block font-body text-sm font-semibold uppercase tracking-wider">
                {item.label}
              </span>
              {isActive && (
                <div className="hidden lg:block ml-auto w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-3 lg:p-4 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300">
          <Settings className="w-5 h-5" />
          <span className="hidden lg:block font-body text-sm font-semibold uppercase tracking-wider">
            Settings
          </span>
        </button>
      </div>
    </aside>
  );
};
