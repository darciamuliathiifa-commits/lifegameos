import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { LifePlannerDashboard } from '@/components/dashboard/LifePlannerDashboard';
import { QuestsPage } from '@/components/quests/QuestsPage';
import { HabitsPage } from '@/components/habits/HabitsPage';
import { GoalsPage } from '@/components/goals/GoalsPage';
import { AchievementsPage } from '@/components/achievements/AchievementsPage';
import { ProfilePage } from '@/components/profile/ProfilePage';
import { useGameStore } from '@/hooks/useGameStore';
import { Helmet } from 'react-helmet-async';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const store = useGameStore();

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
          />
        );
      case 'quests':
        return (
          <QuestsPage
            quests={store.quests}
            onComplete={store.completeQuest}
            onAdd={store.addQuest}
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
        <meta name="description" content="Your personal life operating system. Track quests, habits, goals, and achievements." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <Header profile={store.profile} />
        
        <main className="pl-20 lg:pl-64 pt-16">
          <div className="p-4 lg:p-6 max-w-7xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
