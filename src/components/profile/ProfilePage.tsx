import { User, Calendar, Zap, Target, Flame, Trophy, Edit2 } from 'lucide-react';
import { UserProfile, Stats, XP_PER_LEVEL } from '@/types/game';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface ProfilePageProps {
  profile: UserProfile;
  stats: Stats;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const ProfilePage = ({ profile, stats, onUpdateProfile }: ProfilePageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);

  const xpProgress = (profile.currentXP / XP_PER_LEVEL) * 100;

  const handleSave = () => {
    onUpdateProfile({ name, title });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
          <User className="w-8 h-8 text-primary" />
          Profile
        </h1>
        <Button
          variant={isEditing ? "gaming" : "outline"}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="gap-2"
        >
          <Edit2 className="w-4 h-4" />
          {isEditing ? 'Save' : 'Edit Profile'}
        </Button>
      </div>

      {/* Profile Card */}
      <div className="card-gaming rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Avatar */}
          <div className="relative">
            <ImageUpload
              currentImage={profile.avatar}
              onImageChange={(avatar) => onUpdateProfile({ avatar })}
              variant="avatar"
              className="w-32 h-32 border-4 border-primary shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
            />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
              <span className="font-display text-sm text-primary-foreground">{profile.level}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-3 max-w-xs">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-muted border-border font-display text-xl"
                />
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Your title"
                  className="bg-muted border-border font-body"
                />
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-display text-foreground">{profile.name}</h2>
                <p className="text-lg text-primary font-body mt-1">{profile.title}</p>
              </>
            )}
            
            <div className="flex items-center gap-2 justify-center md:justify-start mt-4 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-body">
                Joined {new Date(profile.joinedAt).toLocaleDateString()}
              </span>
            </div>

            {/* XP Progress */}
            <div className="mt-6 max-w-md">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground font-body">Level {profile.level}</span>
                <span className="text-primary font-display">{profile.currentXP} / {XP_PER_LEVEL} XP</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full xp-bar rounded-full transition-all duration-700 shadow-[0_0_15px_hsl(var(--primary)/0.6)]"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatItem 
          icon={Target} 
          label="Quests Completed" 
          value={stats.questsCompleted}
          color="primary"
        />
        <StatItem 
          icon={Flame} 
          label="Habits Tracked" 
          value={stats.habitsTracked}
          color="accent"
        />
        <StatItem 
          icon={Trophy} 
          label="Goals Achieved" 
          value={stats.goalsAchieved}
          color="success"
        />
        <StatItem 
          icon={Zap} 
          label="Total XP Earned" 
          value={stats.totalXPEarned.toLocaleString()}
          color="secondary"
        />
        <StatItem 
          icon={Flame} 
          label="Current Streak" 
          value={`${stats.currentStreak} days`}
          color="accent"
        />
        <StatItem 
          icon={Trophy} 
          label="Longest Streak" 
          value={`${stats.longestStreak} days`}
          color="primary"
        />
      </div>
    </div>
  );
};

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: 'primary' | 'secondary' | 'accent' | 'success';
}

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
};

const StatItem = ({ icon: Icon, label, value, color }: StatItemProps) => (
  <div className="card-gaming rounded-xl p-5">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorClasses[color]}`}>
      <Icon className="w-5 h-5" />
    </div>
    <p className={`text-2xl font-display ${colorClasses[color].split(' ')[1]}`}>{value}</p>
    <p className="text-sm text-muted-foreground font-body mt-1">{label}</p>
  </div>
);
