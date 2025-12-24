import { Home, Target, Zap, Trophy, User, Settings, Flame, FileText, Wallet, Package, Moon, Brain, Music } from 'lucide-react';
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
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'secondbrain', label: 'Second Brain', icon: Brain },
  { id: 'finance', label: 'Finance', icon: Wallet },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'prayers', label: 'Doa Harian', icon: Moon },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'profile', label: 'Profile', icon: User },
];

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-20 lg:w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="hidden lg:block font-display text-base text-foreground tracking-wide">
            LIFE<span className="text-primary">GAME</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-all duration-200 shrink-0",
                isActive && "drop-shadow-[0_0_6px_hsl(var(--primary))]"
              )} />
              <span className="hidden lg:block font-body text-sm font-medium uppercase tracking-wider">
                {item.label}
              </span>
              {isActive && (
                <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-2 lg:p-3 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200">
          <Settings className="w-5 h-5 shrink-0" />
          <span className="hidden lg:block font-body text-sm font-medium uppercase tracking-wider">
            Settings
          </span>
        </button>
      </div>
    </aside>
  );
};
