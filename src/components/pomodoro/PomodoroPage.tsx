import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Settings2 } from 'lucide-react';
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
  work: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
  sessionsBeforeLongBreak: 4,
};

const modeConfig = {
  work: { label: 'Focus Time', icon: Brain, emoji: '🎯', color: 'primary' },
  shortBreak: { label: 'Short Break', icon: Coffee, emoji: '☕', color: 'secondary' },
  longBreak: { label: 'Long Break', icon: Coffee, emoji: '🌴', color: 'accent' },
};

export const PomodoroPage = () => {
  const [settings] = useState<TimerSettings>(defaultSettings);
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);

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

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(settings[newMode]);
    setIsRunning(false);
  }, [settings]);

  const handleTimerComplete = useCallback(() => {
    if (mode === 'work') {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      setTotalFocusTime(prev => prev + settings.work);
      
      toast.success('🎉 Focus session complete!', {
        description: `You've completed ${newSessions} session${newSessions > 1 ? 's' : ''} today!`
      });

      if (newSessions % settings.sessionsBeforeLongBreak === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      toast.success('☕ Break time over!', {
        description: 'Ready for another focus session?'
      });
      switchMode('work');
    }
  }, [mode, sessionsCompleted, settings, switchMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
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
            <span className="text-3xl">🍅</span> Pomodoro Timer
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            Stay focused and take breaks
          </p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {(Object.keys(modeConfig) as TimerMode[]).map((m) => {
          const config = modeConfig[m];
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
              <span>{config.emoji}</span>
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
                <span className="text-4xl mb-2">{currentModeConfig.emoji}</span>
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
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start
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
            <span className="text-2xl">🎯</span>
            <p className="text-2xl font-display font-bold text-foreground mt-1">{sessionsCompleted}</p>
            <p className="text-xs font-body text-muted-foreground">Sessions</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-5 pb-5">
            <span className="text-2xl">⏱️</span>
            <p className="text-2xl font-display font-bold text-foreground mt-1">
              {Math.floor(totalFocusTime / 60)}m
            </p>
            <p className="text-xs font-body text-muted-foreground">Focus Time</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-5 pb-5">
            <span className="text-2xl">🔥</span>
            <p className="text-2xl font-display font-bold text-foreground mt-1">
              {settings.sessionsBeforeLongBreak - (sessionsCompleted % settings.sessionsBeforeLongBreak)}
            </p>
            <p className="text-xs font-body text-muted-foreground">Until Break</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-5 pb-5">
            <span className="text-2xl">⭐</span>
            <p className="text-2xl font-display font-bold text-foreground mt-1">
              {sessionsCompleted * 25}
            </p>
            <p className="text-xs font-body text-muted-foreground">XP Earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span>💡</span> Pomodoro Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm font-body text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Work in 25-minute focused sessions, then take a 5-minute break
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              After 4 sessions, take a longer 15-minute break
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Remove distractions and focus on one task at a time
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};