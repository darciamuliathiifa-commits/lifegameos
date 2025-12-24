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
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary via-amber-400 to-secondary flex items-center justify-center shadow-lg animate-pulse-glow border border-secondary/30">
            <span className="text-xl">🌿</span>
          </div>
          <div className="hidden lg:block">
            <span className="font-display text-base text-sidebar-foreground tracking-wider">
              Life<span className="text-secondary">Game</span>
            </span>
            <p className="text-[10px] text-sidebar-foreground/60 tracking-widest uppercase">OS</p>
          </div>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

      {/* Navigation */}
      <nav className="flex-1 py-2 px-2 lg:px-3 space-y-0.5 overflow-y-auto">
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
                  ? "bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary border border-secondary/30"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-all duration-200 shrink-0",
                isActive && "drop-shadow-[0_0_8px_hsl(var(--secondary))]"
              )} />
              <span className={cn(
                "hidden lg:block font-body text-sm font-medium tracking-wide",
                isActive ? "text-secondary" : ""
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="hidden lg:block ml-auto">
                  <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_hsl(var(--secondary))]" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Decorative divider */}
      <div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

      {/* Settings */}
      <div className="p-2 lg:p-3">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200">
          <Settings className="w-5 h-5 shrink-0" />
          <span className="hidden lg:block font-body text-sm font-medium tracking-wide">
            Settings
          </span>
        </button>
      </div>
    </aside>
  );
};
