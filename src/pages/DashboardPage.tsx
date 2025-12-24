import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { LifePlannerDashboard } from '@/components/dashboard/LifePlannerDashboard';
import { QuestsPage } from '@/components/quests/QuestsPage';
import { HabitsPage } from '@/components/habits/HabitsPage';
import { GoalsPage } from '@/components/goals/GoalsPage';
import { AchievementsPage } from '@/components/achievements/AchievementsPage';
import { ProfilePage } from '@/components/profile/ProfilePage';
import { NotesPage } from '@/components/notes/NotesPage';
import { FinancePage } from '@/components/finance/FinancePage';
import { InventoryPage } from '@/components/inventory/InventoryPage';
import { PrayersPage } from '@/components/prayers/PrayersPage';
import { SecondBrainPage } from '@/components/secondbrain/SecondBrainPage';
import { MusicPage } from '@/components/music/MusicPage';
import { PomodoroPage } from '@/components/pomodoro/PomodoroPage';
import { TemantiketSpacePage } from '@/components/spaces/TemantiketSpacePage';
import { AIGYPTSpacePage } from '@/components/spaces/AIGYPTSpacePage';
import { useSupabaseGameStore } from '@/hooks/useSupabaseGameStore';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const store = useSupabaseGameStore();

  if (store.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-body">Loading your data...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <LifePlannerDashboard
            stats={store.stats}
            quests={store.quests}
            habits={store.habits}
            goals={store.goals}
            profile={store.profile}
            onCompleteQuest={store.completeQuest}
            onCompleteHabit={store.completeHabit}
            onNavigate={setActiveTab}
            onAddQuest={store.addQuest}
          />
        );
      case 'quests':
        return (
          <QuestsPage
            quests={store.quests}
            onComplete={store.completeQuest}
            onAdd={store.addQuest}
            onEdit={store.updateQuest}
            onDelete={store.deleteQuest}
            onImageUpload={store.updateQuestImage}
          />
        );
      case 'habits':
        return (
          <HabitsPage
            habits={store.habits}
            onComplete={store.completeHabit}
            onAdd={store.addHabit}
            onDelete={store.deleteHabit}
            onImageUpload={store.updateHabitImage}
          />
        );
      case 'goals':
        return (
          <GoalsPage
            goals={store.goals}
            onAdd={store.addGoal}
            onUpdateProgress={store.updateGoalProgress}
            onDelete={store.deleteGoal}
            onImageUpload={store.updateGoalImage}
          />
        );
      case 'achievements':
        return <AchievementsPage achievements={store.achievements} />;
      case 'notes':
        return <NotesPage />;
      case 'secondbrain':
        return <SecondBrainPage />;
      case 'finance':
        return <FinancePage />;
      case 'inventory':
        return <InventoryPage />;
      case 'prayers':
        return <PrayersPage />;
      case 'music':
        return <MusicPage />;
      case 'pomodoro':
        return <PomodoroPage />;
      case 'temantiket':
        return <TemantiketSpacePage />;
      case 'aigypt':
        return <AIGYPTSpacePage />;
      case 'profile':
        return (
          <ProfilePage
            profile={store.profile}
            stats={store.stats}
            onUpdateProfile={store.updateProfile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - LifeGame OS Hub</title>
        <meta name="description" content="Your personal life operating system." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <Header profile={store.profile} />
        
        <main className="pl-0 lg:pl-64 pt-16">
          <div className="p-4 lg:p-6 max-w-7xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
