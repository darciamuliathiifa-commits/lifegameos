import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Settings2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
  sessionsBeforeLongBreak: number;
}

const defaultSettings: TimerSettings = {
  work: 25 * 60, // 25 menit
  shortBreak: 5 * 60, // 5 menit
  longBreak: 15 * 60, // 15 menit
  sessionsBeforeLongBreak: 4,
};

const modeConfig = {
  work: { label: 'Waktu Fokus', icon: Brain, color: 'primary' },
  shortBreak: { label: 'Istirahat Pendek', icon: Coffee, color: 'secondary' },
  longBreak: { label: 'Istirahat Panjang', icon: Coffee, color: 'accent' },
};

export const PomodoroPage = () => {
  const [settings] = useState<TimerSettings>(defaultSettings);
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [autoStartBreak, setAutoStartBreak] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentModeConfig = modeConfig[mode];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = settings[mode];
    return ((total - timeLeft) / total) * 100;
  };

  const playNotificationSound = useCallback(() => {
    if (soundEnabled) {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  }, [soundEnabled]);

  const switchMode = useCallback((newMode: TimerMode, autoStart: boolean = false) => {
    setMode(newMode);
    setTimeLeft(settings[newMode]);
    setIsRunning(autoStart);
  }, [settings]);

  const handleTimerComplete = useCallback(() => {
    playNotificationSound();
    
    if (mode === 'work') {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      setTotalFocusTime(prev => prev + settings.work);
      
      toast.success('🎉 Sesi fokus selesai!', {
        description: `Kamu sudah menyelesaikan ${newSessions} sesi hari ini!`
      });

      // Auto start break
      if (newSessions % settings.sessionsBeforeLongBreak === 0) {
        switchMode('longBreak', autoStartBreak);
        if (autoStartBreak) {
          toast.info('🌴 Istirahat panjang dimulai otomatis!');
        }
      } else {
        switchMode('shortBreak', autoStartBreak);
        if (autoStartBreak) {
          toast.info('☕ Istirahat pendek dimulai otomatis!');
        }
      }
    } else {
      toast.success('⏰ Waktu istirahat selesai!', {
        description: 'Siap untuk sesi fokus berikutnya?'
      });
      switchMode('work', false);
    }
  }, [mode, sessionsCompleted, settings, switchMode, autoStartBreak, playNotificationSound]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, handleTimerComplete]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setTimeLeft(settings[mode]);
    setIsRunning(false);
  };

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (getProgress() / 100) * circumference;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display text-foreground flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" /> Timer Pomodoro
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            Tetap fokus dan ambil istirahat
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="gap-2"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {soundEnabled ? 'Suara Aktif' : 'Suara Mati'}
          </Button>
          <Button
            variant={autoStartBreak ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoStartBreak(!autoStartBreak)}
            className="gap-2"
          >
            {autoStartBreak ? 'Auto Istirahat: ON' : 'Auto Istirahat: OFF'}
          </Button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {(Object.keys(modeConfig) as TimerMode[]).map((m) => {
          const config = modeConfig[m];
          const Icon = config.icon;
          return (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-semibold transition-all duration-200",
                mode === m
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Timer Display */}
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 pb-8 flex flex-col items-center">
            {/* Circular Progress */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="120"
                  stroke="hsl(var(--muted))"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="120"
                  stroke={mode === 'work' ? 'hsl(var(--primary))' : mode === 'shortBreak' ? 'hsl(var(--secondary))' : 'hsl(var(--accent))'}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000"
                />
              </svg>
              
              {/* Timer Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {mode === 'work' ? (
                  <Brain className="w-10 h-10 mb-2 text-primary" />
                ) : (
                  <Coffee className="w-10 h-10 mb-2 text-secondary" />
                )}
                <span className="text-5xl sm:text-6xl font-display font-bold text-foreground tabular-nums">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-sm font-body text-muted-foreground mt-2">
                  {currentModeConfig.label}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={resetTimer}
                className="h-12 w-12"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              
              <Button
                variant={mode === 'work' ? 'default' : 'secondary'}
                size="lg"
                onClick={toggleTimer}
                className="h-14 px-10 text-lg gap-2"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Jeda
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Mulai
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
              >
                <Settings2 className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-5 pb-5">
            <Brain className="w-6 h-6 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-display font-bold text-foreground mt-1">{sessionsCompleted}</p>
            <p className="text-xs font-body text-muted-foreground">Sesi</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-5 pb-5">
            <Coffee className="w-6 h-6 mx-auto mb-1 text-secondary" />
            <p className="text-2xl font-display font-bold text-foreground mt-1">
              {Math.floor(totalFocusTime / 60)}m
            </p>
            <p className="text-xs font-body text-muted-foreground">Waktu Fokus</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-5 pb-5">
            <RotateCcw className="w-6 h-6 mx-auto mb-1 text-accent" />
            <p className="text-2xl font-display font-bold text-foreground mt-1">
              {settings.sessionsBeforeLongBreak - (sessionsCompleted % settings.sessionsBeforeLongBreak)}
            </p>
            <p className="text-xs font-body text-muted-foreground">Sampai Istirahat</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-5 pb-5">
            <Brain className="w-6 h-6 mx-auto mb-1 text-success" />
            <p className="text-2xl font-display font-bold text-foreground mt-1">
              {sessionsCompleted * 25}
            </p>
            <p className="text-xs font-body text-muted-foreground">XP Diperoleh</p>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> Tips Pomodoro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm font-body text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Bekerja dalam sesi fokus 25 menit, lalu ambil istirahat 5 menit
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Setelah 4 sesi, ambil istirahat panjang 15 menit
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Hilangkan gangguan dan fokus pada satu tugas dalam satu waktu
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Istirahat otomatis akan dimulai setelah sesi fokus selesai
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};