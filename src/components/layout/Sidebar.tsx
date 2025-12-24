import { Home, Target, Zap, Trophy, User, Settings, Flame, FileText, Wallet, Package, Moon, Brain, Music, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, emoji: '🏠' },
  { id: 'quests', label: 'Quests', icon: Target, emoji: '🎯' },
  { id: 'habits', label: 'Habits', icon: Flame, emoji: '🔥' },
  { id: 'goals', label: 'Goals', icon: Zap, emoji: '⚡' },
  { id: 'achievements', label: 'Achievements', icon: Trophy, emoji: '🏆' },
  { id: 'notes', label: 'Notes', icon: FileText, emoji: '📝' },
  { id: 'secondbrain', label: 'Second Brain', icon: Brain, emoji: '🧠' },
  { id: 'finance', label: 'Finance', icon: Wallet, emoji: '💰' },
  { id: 'inventory', label: 'Inventory', icon: Package, emoji: '📦' },
  { id: 'prayers', label: 'Doa Harian', icon: Moon, emoji: '🌙' },
  { id: 'music', label: 'Music', icon: Music, emoji: '🎵' },
  { id: 'profile', label: 'Profile', icon: User, emoji: '👤' },
];

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar flex flex-col transition-transform duration-300",
        "w-72 lg:w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-secondary via-amber-400 to-orange-500 flex items-center justify-center shadow-lg animate-bounce-gentle">
              <span className="text-xl">🌴</span>
            </div>
            <div>
              <span className="font-display text-lg text-sidebar-foreground tracking-wide">
                Life<span className="text-secondary">Game</span>
              </span>
              <p className="text-[11px] text-sidebar-foreground/60 font-body tracking-wide">Adventure OS</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-secondary/25 to-secondary/15 text-secondary shadow-md border border-secondary/30"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <span className="text-lg">{item.emoji}</span>
                <span className={cn(
                  "font-body text-sm font-semibold tracking-wide flex-1 text-left",
                  isActive ? "text-secondary" : ""
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_12px_hsl(var(--secondary))] animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="p-3 border-t border-sidebar-border">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200">
            <span className="text-lg">⚙️</span>
            <span className="font-body text-sm font-semibold tracking-wide">
              Settings
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};