import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { QuestsPage } from '@/components/quests/QuestsPage';
import { HabitsPage } from '@/components/habits/HabitsPage';
import { GoalsPage } from '@/components/goals/GoalsPage';
import { AchievementsPage } from '@/components/achievements/AchievementsPage';
import { ProfilePage } from '@/components/profile/ProfilePage';
import { useGameStore } from '@/hooks/useGameStore';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const store = useGameStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            stats={store.stats}
            quests={store.quests}
            habits={store.habits}
            goals={store.goals}
            profile={store.profile}
            onCompleteQuest={store.completeQuest}
            onCompleteHabit={store.completeHabit}
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
        <title>LifeGame OS - Gamify Your Life</title>
        <meta name="description" content="Transform your daily routine into an epic adventure. Track quests, build habits, achieve goals, and level up your life with LifeGame OS." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <Header profile={store.profile} />
        
        <main className="pl-20 lg:pl-64 pt-20">
          <div className="p-6 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default Index;
