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

interface LocationData {
  city: string;
  country: string;
  prayerTimes: PrayerTime[];
  nextPrayer: { name: string; time: string; countdown: string } | null;
  currentPrayer: string;
}

const locations = [
  { city: 'Cairo', country: 'Egypt' },
  { city: 'Tangerang', country: 'Indonesia' },
];

export const PrayerTimesWidget = () => {
  const [locationData, setLocationData] = useState<Record<string, LocationData>>({});
  const [loading, setLoading] = useState(true);

  const prayerNames: Record<string, string> = {
    Fajr: 'الفجر',
    Sunrise: 'الشروق',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء'
  };

  const formatCountdown = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const calculateCurrentAndNext = (prayers: PrayerTime[]) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    let nextPrayer = null;
    let currentPrayer = '';
    
    for (let i = 0; i < prayers.length; i++) {
      const [hours, minutes] = prayers[i].time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      
      if (currentMinutes < prayerMinutes) {
        nextPrayer = {
          name: prayers[i].name,
          time: prayers[i].time,
          countdown: formatCountdown(prayerMinutes - currentMinutes)
        };
        if (i > 0) {
          currentPrayer = prayers[i - 1].name;
        }
        break;
      }
    }
    
    if (!nextPrayer) {
      currentPrayer = prayers[prayers.length - 1].name;
      nextPrayer = {
        name: prayers[0].name,
        time: prayers[0].time,
        countdown: 'Tomorrow'
      };
    }

    return { nextPrayer, currentPrayer };
  };

  const fetchPrayerTimesForLocation = async (city: string, country: string) => {
    try {
      const today = new Date();
      const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${city}&country=${country}&method=5`
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
        
        const { nextPrayer, currentPrayer } = calculateCurrentAndNext(prayers);
        
        return {
          city,
          country,
          prayerTimes: prayers,
          nextPrayer,
          currentPrayer
        };
      }
    } catch (error) {
      console.error(`Error fetching prayer times for ${city}:`, error);
    }
    return null;
  };

  const fetchAllPrayerTimes = async () => {
    setLoading(true);
    const results: Record<string, LocationData> = {};
    
    for (const loc of locations) {
      const data = await fetchPrayerTimesForLocation(loc.city, loc.country);
      if (data) {
        results[loc.city] = data;
      }
    }
    
    setLocationData(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllPrayerTimes();
    const interval = setInterval(() => {
      // Update countdown every minute
      setLocationData(prev => {
        const updated = { ...prev };
        for (const key of Object.keys(updated)) {
          const { nextPrayer, currentPrayer } = calculateCurrentAndNext(updated[key].prayerTimes);
          updated[key] = { ...updated[key], nextPrayer, currentPrayer };
        }
        return updated;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="py-6">
          <div className="h-48 bg-muted rounded-lg" />
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
            <h3 className="font-display text-foreground text-sm">Prayer Times</h3>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={fetchAllPrayerTimes}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Two Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((loc) => {
            const data = locationData[loc.city];
            if (!data) return null;
            
            return (
              <div key={loc.city} className="space-y-3">
                {/* Location Header */}
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{loc.city}, {loc.country}</span>
                </div>
                
                {/* Next Prayer Highlight */}
                {data.nextPrayer && (
                  <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                    <p className="text-xs text-emerald-400 font-body mb-1">Next Prayer</p>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-base text-foreground">{data.nextPrayer.name}</span>
                      <div className="text-right">
                        <span className="text-base font-bold text-emerald-400">{data.nextPrayer.time}</span>
                        <p className="text-xs text-muted-foreground">in {data.nextPrayer.countdown}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Prayer Times Grid */}
                <div className="grid grid-cols-3 gap-1">
                  {data.prayerTimes.map((prayer) => (
                    <div
                      key={prayer.name}
                      className={cn(
                        "p-1.5 rounded-lg text-center transition-all",
                        data.currentPrayer === prayer.name 
                          ? "bg-emerald-500/30 ring-1 ring-emerald-500/50" 
                          : "bg-muted/30 hover:bg-muted/50"
                      )}
                    >
                      <p className="text-[10px] text-muted-foreground font-body">{prayer.name}</p>
                      <p className="text-xs font-bold text-foreground">{prayer.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};