import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Menu, X, ChevronLeft } from 'lucide-react';
import {
  IconDashboard, IconTarget, IconFlame, IconBolt, IconTrophy,
  IconNote, IconBrain, IconWallet, IconInventory, IconMoon,
  IconMusic, IconTimer, IconProfile
} from '@/components/icons/CleanIcons';

// Import custom logos
import temantiketLogo from '@/assets/temantiket-logo.png';
import aigyptLogo from '@/assets/aigypt-logo.png';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navSections = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', Icon: IconDashboard },
    ]
  },
  {
    title: 'Productivity',
    items: [
      { id: 'quests', label: 'Quests', Icon: IconTarget },
      { id: 'habits', label: 'Habits', Icon: IconFlame },
      { id: 'goals', label: 'Goals', Icon: IconBolt },
      { id: 'pomodoro', label: 'Pomodoro', Icon: IconTimer },
    ]
  },
  {
    title: 'Knowledge',
    items: [
      { id: 'notes', label: 'Notes', Icon: IconNote },
      { id: 'secondbrain', label: 'Second Brain', Icon: IconBrain },
    ]
  },
  {
    title: 'Life',
    items: [
      { id: 'finance', label: 'Finance', Icon: IconWallet },
      { id: 'inventory', label: 'Inventory', Icon: IconInventory },
      { id: 'prayers', label: 'Prayers', Icon: IconMoon },
      { id: 'music', label: 'Music', Icon: IconMusic },
    ]
  },
  {
    title: 'Spaces',
    items: [
      { id: 'temantiket', label: 'Temantiket', customIcon: temantiketLogo },
      { id: 'aigypt', label: 'AIGYPT', customIcon: aigyptLogo },
    ]
  },
  {
    title: 'Account',
    items: [
      { id: 'achievements', label: 'Achievements', Icon: IconTrophy },
      { id: 'profile', label: 'Profile', Icon: IconProfile },
    ]
  },
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
        className="fixed top-3 left-3 z-50 lg:hidden p-2.5 rounded-xl glass-card text-foreground"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen glass-sidebar flex flex-col transition-transform duration-300",
        "w-64 lg:w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
              <IconBolt className="w-5 h-5 text-white" size={20} />
            </div>
            <div>
              <span className="font-display text-base font-semibold text-sidebar-foreground">
                LifeGame
              </span>
              <p className="text-[10px] text-muted-foreground font-body">OS Hub</p>
            </div>
          </div>
          <button className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg hover:bg-muted/30 text-muted-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-primary/70">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                        isActive
                          ? "glass-button text-sidebar-foreground"
                          : "text-muted-foreground hover:bg-muted/20 hover:text-sidebar-foreground"
                      )}
                    >
                      {'customIcon' in item && item.customIcon ? (
                        <img 
                          src={item.customIcon} 
                          alt={item.label} 
                          className={cn(
                            "w-[18px] h-[18px] object-contain transition-all",
                            isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                          )}
                        />
                      ) : 'Icon' in item && item.Icon && (
                        <item.Icon 
                          className={cn(
                            "transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
                          )} 
                          size={18} 
                        />
                      )}
                      <span className="font-body text-sm flex-1 text-left">
                        {item.label}
                      </span>
                      {isActive && (
                        <div className="w-1.5 h-5 rounded-full bg-primary shadow-lg shadow-primary/50" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};