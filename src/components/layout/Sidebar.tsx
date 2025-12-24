import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import {
  IconDashboard, IconTarget, IconFlame, IconBolt, IconTrophy,
  IconNote, IconBrain, IconWallet, IconInventory, IconMoon,
  IconMusic, IconTimer, IconTicket, IconPyramid, IconProfile
} from '@/components/icons/CleanIcons';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: IconDashboard },
  { id: 'quests', label: 'Quests', Icon: IconTarget },
  { id: 'habits', label: 'Habits', Icon: IconFlame },
  { id: 'goals', label: 'Goals', Icon: IconBolt },
  { id: 'achievements', label: 'Achievements', Icon: IconTrophy },
  { id: 'notes', label: 'Notes', Icon: IconNote },
  { id: 'secondbrain', label: 'Second Brain', Icon: IconBrain },
  { id: 'finance', label: 'Finance', Icon: IconWallet },
  { id: 'inventory', label: 'Inventory', Icon: IconInventory },
  { id: 'prayers', label: 'Doa Harian', Icon: IconMoon },
  { id: 'music', label: 'Music', Icon: IconMusic },
  { id: 'pomodoro', label: 'Pomodoro', Icon: IconTimer },
  { id: 'temantiket', label: 'Temantiket Space', Icon: IconTicket },
  { id: 'aigypt', label: 'AIGYPT Space', Icon: IconPyramid },
  { id: 'profile', label: 'Profile', Icon: IconProfile },
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
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
              <IconDashboard className="w-6 h-6 text-white" size={24} />
            </div>
            <div>
              <span className="font-display text-lg text-sidebar-foreground tracking-wide">
                Life<span className="text-primary">Game</span>
              </span>
              <p className="text-[11px] text-sidebar-foreground/60 font-body tracking-wide">OS Hub</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-primary/25 to-primary/15 text-primary shadow-md border border-primary/30"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.Icon 
                  className={cn(
                    "transition-all duration-200",
                    isActive ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-primary"
                  )} 
                  size={20} 
                />
                <span className={cn(
                  "font-body text-sm font-medium tracking-wide flex-1 text-left",
                  isActive ? "text-primary" : ""
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))] animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="p-3 border-t border-sidebar-border">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200">
            <IconTarget className="w-5 h-5 text-sidebar-foreground/60" size={20} />
            <span className="font-body text-sm font-medium tracking-wide">
              Settings
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
