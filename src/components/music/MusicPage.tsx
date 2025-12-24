import { Music } from 'lucide-react';
import { MusicPlayer } from '@/components/music/MusicPlayer';

export const MusicPage = () => {
  return (
    <div className="space-y-6 animate-slide-up max-w-2xl">
      <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
        <Music className="w-8 h-8 text-primary" />
        Music Player
      </h1>
      
      <p className="text-muted-foreground font-body">
        Lofi beats to focus and relax. Perfect for study sessions and deep work.
      </p>

      <MusicPlayer />
    </div>
  );
};
