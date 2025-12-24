import { useState, useEffect } from 'react';
import { Clock, MapPin, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
}

interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export const PrayerTimesWidget = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPrayer, setCurrentPrayer] = useState<string>('');
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; countdown: string } | null>(null);
  const [location, setLocation] = useState({ city: 'Cairo', country: 'Egypt' });

  const prayerNames: Record<string, string> = {
    Fajr: 'الفجر',
    Sunrise: 'الشروق',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء'
  };

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${location.city}&country=${location.country}&method=5`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        const timings: PrayerTimesData = data.data.timings;
        const prayers: PrayerTime[] = [
          { name: 'Fajr', time: timings.Fajr, arabicName: prayerNames.Fajr },
          { name: 'Sunrise', time: timings.Sunrise, arabicName: prayerNames.Sunrise },
          { name: 'Dhuhr', time: timings.Dhuhr, arabicName: prayerNames.Dhuhr },
          { name: 'Asr', time: timings.Asr, arabicName: prayerNames.Asr },
          { name: 'Maghrib', time: timings.Maghrib, arabicName: prayerNames.Maghrib },
          { name: 'Isha', time: timings.Isha, arabicName: prayerNames.Isha },
        ];
        setPrayerTimes(prayers);
        calculateCurrentAndNext(prayers);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
    setLoading(false);
  };

  const calculateCurrentAndNext = (prayers: PrayerTime[]) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    let found = false;
    for (let i = 0; i < prayers.length; i++) {
      const [hours, minutes] = prayers[i].time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      
      if (currentMinutes < prayerMinutes) {
        setNextPrayer({
          name: prayers[i].name,
          time: prayers[i].time,
          countdown: formatCountdown(prayerMinutes - currentMinutes)
        });
        if (i > 0) {
          setCurrentPrayer(prayers[i - 1].name);
        }
        found = true;
        break;
      }
    }
    
    if (!found) {
      setCurrentPrayer(prayers[prayers.length - 1].name);
      setNextPrayer({
        name: prayers[0].name,
        time: prayers[0].time,
        countdown: 'Tomorrow'
      });
    }
  };

  const formatCountdown = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  useEffect(() => {
    fetchPrayerTimes();
    const interval = setInterval(() => {
      if (prayerTimes.length > 0) {
        calculateCurrentAndNext(prayerTimes);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [location]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="py-6">
          <div className="h-32 bg-muted rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
      <CardContent className="py-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-display text-foreground text-sm">Prayer Times</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {location.city}, {location.country}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={fetchPrayerTimes}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Next Prayer Highlight */}
        {nextPrayer && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <p className="text-xs text-emerald-400 font-body mb-1">Next Prayer</p>
            <div className="flex items-center justify-between">
              <span className="font-display text-lg text-foreground">{nextPrayer.name}</span>
              <div className="text-right">
                <span className="text-lg font-bold text-emerald-400">{nextPrayer.time}</span>
                <p className="text-xs text-muted-foreground">in {nextPrayer.countdown}</p>
              </div>
            </div>
          </div>
        )}

        {/* Prayer Times Grid */}
        <div className="grid grid-cols-3 gap-2">
          {prayerTimes.map((prayer) => (
            <div
              key={prayer.name}
              className={cn(
                "p-2 rounded-lg text-center transition-all",
                currentPrayer === prayer.name 
                  ? "bg-emerald-500/30 ring-1 ring-emerald-500/50" 
                  : "bg-muted/30 hover:bg-muted/50"
              )}
            >
              <p className="text-xs text-muted-foreground font-body">{prayer.name}</p>
              <p className="text-sm font-bold text-foreground">{prayer.time}</p>
              <p className="text-xs text-emerald-400/80" dir="rtl">{prayer.arabicName}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
