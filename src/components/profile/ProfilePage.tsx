import { User, Calendar, Zap, Target, Flame, Trophy, Edit2, Camera, Save, X, Loader2 } from 'lucide-react';
import { UserProfile, Stats, XP_PER_LEVEL } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfilePageProps {
  profile: UserProfile;
  stats: Stats;
  onUpdateProfile: (updates: Partial<{ name: string; title: string; avatar_url: string }>) => void;
}

export const ProfilePage = ({ profile, stats, onUpdateProfile }: ProfilePageProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync local state when profile changes
  useEffect(() => {
    setName(profile.name);
    setTitle(profile.title);
  }, [profile.name, profile.title]);

  const xpProgress = (profile.currentXP / XP_PER_LEVEL) * 100;

  const handleSave = async () => {
    await onUpdateProfile({ name, title });
    setIsEditing(false);
    toast.success('Profil berhasil diperbarui!');
  };

  const handleCancel = () => {
    setName(profile.name);
    setTitle(profile.title);
    setIsEditing(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      onUpdateProfile({ avatar_url: publicUrl });
      toast.success('Foto profil berhasil diperbarui!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Gagal mengupload foto');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-slide-up max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-display text-foreground flex items-center gap-3">
          <User className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          Profil
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="gap-2 flex-1 sm:flex-none"
              >
                <X className="w-4 h-4" />
                Batal
              </Button>
              <Button
                variant="gaming"
                onClick={handleSave}
                className="gap-2 flex-1 sm:flex-none"
              >
                <Save className="w-4 h-4" />
                Simpan
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="gap-2 w-full sm:w-auto"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profil
            </Button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="card-gaming rounded-2xl p-4 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
          {/* Avatar */}
          <div className="relative group">
            <Avatar className="w-28 h-28 md:w-32 md:h-32 border-4 border-primary shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
              <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />
              <AvatarFallback className="bg-primary/20 text-primary text-3xl md:text-4xl font-display">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {/* Upload Overlay */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute inset-0 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
            >
              {isUploadingAvatar ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : (
                <Camera className="w-6 h-6 text-primary" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            
            {/* Level Badge */}
            <div className="absolute -bottom-2 -right-2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
              <span className="font-display text-xs md:text-sm text-primary-foreground">{profile.level}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left w-full">
            {isEditing ? (
              <div className="space-y-3 max-w-xs mx-auto md:mx-0">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Nama</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama kamu"
                    className="bg-muted border-border font-display text-lg md:text-xl"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Gelar</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Gelar kamu"
                    className="bg-muted border-border font-body"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl font-display text-foreground">{profile.name}</h2>
                <p className="text-base md:text-lg text-primary font-body mt-1">{profile.title}</p>
              </>
            )}
            
            <div className="flex items-center gap-2 justify-center md:justify-start mt-4 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-xs md:text-sm font-body">
                Bergabung {new Date(profile.joinedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            {/* XP Progress */}
            <div className="mt-6 max-w-md mx-auto md:mx-0">
              <div className="flex justify-between text-xs md:text-sm mb-2">
                <span className="text-muted-foreground font-body">Level {profile.level}</span>
                <span className="text-primary font-display">{profile.currentXP} / {XP_PER_LEVEL} XP</span>
              </div>
              <div className="h-2.5 md:h-3 bg-muted rounded-full overflow-hidden">
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <StatItem 
          icon={Target} 
          label="Misi Selesai" 
          value={stats.questsCompleted}
          color="primary"
        />
        <StatItem 
          icon={Flame} 
          label="Kebiasaan" 
          value={stats.habitsTracked}
          color="accent"
        />
        <StatItem 
          icon={Trophy} 
          label="Goal Tercapai" 
          value={stats.goalsAchieved}
          color="success"
        />
        <StatItem 
          icon={Zap} 
          label="Total XP" 
          value={stats.totalXPEarned.toLocaleString()}
          color="secondary"
        />
        <StatItem 
          icon={Flame} 
          label="Streak Saat Ini" 
          value={`${stats.currentStreak} hari`}
          color="accent"
        />
        <StatItem 
          icon={Trophy} 
          label="Streak Terpanjang" 
          value={`${stats.longestStreak} hari`}
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
  <div className="card-gaming rounded-xl p-4 md:p-5">
    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mb-2 md:mb-3 ${colorClasses[color]}`}>
      <Icon className="w-4 h-4 md:w-5 md:h-5" />
    </div>
    <p className={`text-xl md:text-2xl font-display ${colorClasses[color].split(' ')[1]}`}>{value}</p>
    <p className="text-xs md:text-sm text-muted-foreground font-body mt-1">{label}</p>
  </div>
);
