import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  url?: string;
}

interface MusicPlayerProps {
  className?: string;
  compact?: boolean;
}

export const MusicPlayer = ({ className, compact = false }: MusicPlayerProps) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch tracks on mount
  useEffect(() => {
    fetchTracks();
  }, []);

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const fetchTracks = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/music-api`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ action: 'list' }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setTracks(data.tracks);
      }
    } catch (error) {
      console.error('Failed to fetch tracks:', error);
    }
  };

  const loadTrack = async (trackId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/music-api`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ action: 'get', trackId }),
        }
      );

      const data = await response.json();
      if (data.success && data.track) {
        setCurrentTrack(data.track);
        
        if (audioRef.current) {
          audioRef.current.src = data.track.url;
          audioRef.current.load();
          await audioRef.current.play();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Failed to load track:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = async () => {
    if (!currentTrack && tracks.length > 0) {
      await loadTrack(tracks[0].id);
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = async () => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    await loadTrack(tracks[nextIndex].id);
  };

  const playPrevious = async () => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    await loadTrack(tracks[prevIndex].id);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <div className={cn("card-gaming rounded-xl p-5 space-y-5 border border-border/50", className)}>
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={playNext}
          onLoadedMetadata={handleTimeUpdate}
        />
        
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-secondary via-primary/80 to-primary flex items-center justify-center shadow-[0_0_25px_hsl(var(--secondary)/0.4)]">
            {isLoading ? (
              <Loader2 className="w-9 h-9 text-foreground animate-spin" />
            ) : (
              <Music className="w-9 h-9 text-foreground drop-shadow-md" />
            )}
          </div>
          <div className="flex-1 pt-1">
            <p className="font-display text-base text-foreground">
              {currentTrack?.title || 'Lofi Focus Mix'}
            </p>
            <p className="text-sm text-muted-foreground font-body">
              {currentTrack?.artist || 'Select a track'}
            </p>
            <button 
              onClick={togglePlay}
              disabled={isLoading}
              className="mt-2.5 flex items-center gap-1.5 text-sm text-primary font-body hover:underline transition-all disabled:opacity-50"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Play Now
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        {currentTrack && (
          <div className="space-y-1">
            <Slider
              value={[progress]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-body">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
        
        {/* Mini Playlist */}
        <div className="space-y-1">
          {tracks.slice(0, 4).map((track) => (
            <button
              key={track.id}
              onClick={() => loadTrack(track.id)}
              disabled={isLoading}
              className={cn(
                "w-full flex items-center justify-between py-2.5 border-b border-border/20 last:border-0 group hover:bg-muted/20 -mx-2 px-2 rounded transition-colors text-left",
                currentTrack?.id === track.id && "bg-primary/10"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className={cn(
                  "text-sm",
                  currentTrack?.id === track.id && isPlaying ? "text-primary animate-pulse" : "text-primary"
                )}>
                  {currentTrack?.id === track.id && isPlaying ? '▶' : '♫'}
                </span>
                <span className={cn(
                  "text-sm font-body transition-colors",
                  currentTrack?.id === track.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {track.title}
                </span>
              </div>
              <span className="text-xs text-muted-foreground/70 font-body">
                {track.duration}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Full player view
  return (
    <div className={cn("card-gaming rounded-xl p-6 space-y-6", className)}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
        onLoadedMetadata={handleTimeUpdate}
      />
      
      {/* Album Art & Info */}
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-secondary via-primary/80 to-primary flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.4)]">
          {isLoading ? (
            <Loader2 className="w-12 h-12 text-foreground animate-spin" />
          ) : (
            <Music className="w-12 h-12 text-foreground" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-display text-xl text-foreground">
            {currentTrack?.title || 'No Track Selected'}
          </h3>
          <p className="text-muted-foreground font-body">
            {currentTrack?.artist || 'Choose a track to play'}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Slider
          value={[progress]}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground font-body">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={playPrevious}
          disabled={isLoading || tracks.length === 0}
          className="hover:bg-muted/50"
        >
          <SkipBack className="w-5 h-5" />
        </Button>
        
        <Button
          variant="gaming"
          size="icon"
          onClick={togglePlay}
          disabled={isLoading}
          className="w-14 h-14 rounded-full"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={playNext}
          disabled={isLoading || tracks.length === 0}
          className="hover:bg-muted/50"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          className="h-8 w-8"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          max={100}
          step={1}
          onValueChange={(v) => {
            setVolume(v[0]);
            setIsMuted(false);
          }}
          className="flex-1"
        />
      </div>

      {/* Track List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => loadTrack(track.id)}
            disabled={isLoading}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left",
              currentTrack?.id === track.id 
                ? "bg-primary/20 border border-primary/30" 
                : "hover:bg-muted/30"
            )}
          >
            <div className="flex items-center gap-3">
              <span className={cn(
                "text-lg",
                currentTrack?.id === track.id && isPlaying ? "text-primary animate-pulse" : "text-muted-foreground"
              )}>
                {currentTrack?.id === track.id && isPlaying ? '▶' : '♪'}
              </span>
              <div>
                <p className="font-body text-foreground">{track.title}</p>
                <p className="text-xs text-muted-foreground">{track.artist}</p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground font-body">{track.duration}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
