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
  timezone: string;
  prayerTimes: PrayerTime[];
  nextPrayer: { name: string; time: string; countdown: string } | null;
  currentPrayer: string;
}

const locations = [
  { city: 'Tangerang', country: 'Indonesia', timezone: 'Asia/Jakarta' },
  { city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo' },
];

export const PrayerTimesWidget = () => {
  const [locationData, setLocationData] = useState<Record<string, LocationData>>({});
  const [loading, setLoading] = useState(true);
  const [currentTimes, setCurrentTimes] = useState<Record<string, string>>({});

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

  // Get current time in a specific timezone
  const getCurrentTimeInTimezone = (timezone: string) => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timezone
    };
    return now.toLocaleTimeString('en-US', options);
  };

  // Parse time string "HH:MM" to minutes from midnight in local timezone
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const calculateCurrentAndNext = (prayers: PrayerTime[], timezone: string) => {
    const currentTime = getCurrentTimeInTimezone(timezone);
    const currentMinutes = timeToMinutes(currentTime);
    
    let nextPrayer = null;
    let currentPrayer = '';
    
    for (let i = 0; i < prayers.length; i++) {
      const prayerMinutes = timeToMinutes(prayers[i].time);
      
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
        countdown: 'Besok'
      };
    }

    return { nextPrayer, currentPrayer };
  };

  const fetchPrayerTimesForLocation = async (city: string, country: string, timezone: string) => {
    try {
      const today = new Date();
      const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      
      // Use method 20 (Egyptian General Authority of Survey) for Egypt
      // Use method 11 (Islamic Society of North America) for Indonesia which is more accurate
      const method = country === 'Egypt' ? 5 : 20;
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${city}&country=${country}&method=${method}`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        const timings: PrayerTimesData = data.data.timings;
        
        // Extract just the time part (remove timezone info like "(WIB)")
        const cleanTime = (time: string) => time.split(' ')[0];
        
        const prayers: PrayerTime[] = [
          { name: 'Subuh', time: cleanTime(timings.Fajr), arabicName: prayerNames.Fajr },
          { name: 'Syuruq', time: cleanTime(timings.Sunrise), arabicName: prayerNames.Sunrise },
          { name: 'Dzuhur', time: cleanTime(timings.Dhuhr), arabicName: prayerNames.Dhuhr },
          { name: 'Ashar', time: cleanTime(timings.Asr), arabicName: prayerNames.Asr },
          { name: 'Maghrib', time: cleanTime(timings.Maghrib), arabicName: prayerNames.Maghrib },
          { name: 'Isya', time: cleanTime(timings.Isha), arabicName: prayerNames.Isha },
        ];
        
        const { nextPrayer, currentPrayer } = calculateCurrentAndNext(prayers, timezone);
        
        return {
          city,
          country,
          timezone,
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
    
    const promises = locations.map(loc => 
      fetchPrayerTimesForLocation(loc.city, loc.country, loc.timezone)
    );
    
    const responses = await Promise.all(promises);
    responses.forEach((data, index) => {
      if (data) {
        results[locations[index].city] = data;
      }
    });
    
    setLocationData(results);
    setLoading(false);
  };

  // Update current times for each timezone
  const updateCurrentTimes = () => {
    const times: Record<string, string> = {};
    locations.forEach(loc => {
      times[loc.city] = getCurrentTimeInTimezone(loc.timezone);
    });
    setCurrentTimes(times);
  };

  useEffect(() => {
    fetchAllPrayerTimes();
    updateCurrentTimes();
    
    const interval = setInterval(() => {
      updateCurrentTimes();
      // Update countdown
      setLocationData(prev => {
        const updated = { ...prev };
        for (const key of Object.keys(updated)) {
          const loc = locations.find(l => l.city === key);
          if (loc) {
            const { nextPrayer, currentPrayer } = calculateCurrentAndNext(updated[key].prayerTimes, loc.timezone);
            updated[key] = { ...updated[key], nextPrayer, currentPrayer };
          }
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
            <h3 className="font-display text-foreground text-sm">Waktu Sholat</h3>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{loc.city}, {loc.country}</span>
                  </div>
                  <span className="text-xs font-mono text-primary">{currentTimes[loc.city]}</span>
                </div>
                
                {/* Next Prayer Highlight */}
                {data.nextPrayer && (
                  <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                    <p className="text-xs text-emerald-400 font-body mb-1">Sholat Berikutnya</p>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-base text-foreground">{data.nextPrayer.name}</span>
                      <div className="text-right">
                        <span className="text-base font-bold text-emerald-400">{data.nextPrayer.time}</span>
                        <p className="text-xs text-muted-foreground">{data.nextPrayer.countdown}</p>
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