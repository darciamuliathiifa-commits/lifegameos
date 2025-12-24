import { useState, useEffect } from 'react';
import { Moon, Plus, Star, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Prayer {
  id: string;
  title: string;
  arabic_text: string | null;
  translation: string | null;
  transliteration: string | null;
  category: string;
  is_favorite: boolean;
}

const defaultPrayers = [
  {
    title: 'Doa Sebelum Tidur',
    arabic_text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: "Bismika Allahumma amuutu wa ahyaa",
    translation: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup',
    category: 'daily'
  },
  {
    title: 'Doa Bangun Tidur',
    arabic_text: 'اَلْحَمْدُ ِللهِ الَّذِيْ أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُوْرُ',
    transliteration: "Alhamdulillahilladzi ahyaanaa ba'da maa amaatanaa wa ilaihin nusyuur",
    translation: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami dan kepada-Nya kami dikembalikan',
    category: 'daily'
  },
  {
    title: 'Doa Sebelum Makan',
    arabic_text: 'اَللَّهُمَّ بَارِكْ لَنَا فِيْمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
    transliteration: "Allahumma baarik lanaa fiimaa razaqtanaa wa qinaa 'adzaaban naar",
    translation: 'Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami dan lindungilah kami dari siksa api neraka',
    category: 'daily'
  },
  {
    title: 'Doa Sesudah Makan',
    arabic_text: 'اَلْحَمْدُ ِللهِ الَّذِيْ أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِيْنَ',
    transliteration: "Alhamdulillahilladzi ath'amanaa wa saqaanaa wa ja'alanaa minal muslimiin",
    translation: 'Segala puji bagi Allah yang telah memberi makan dan minum kepada kami dan menjadikan kami termasuk orang-orang muslim',
    category: 'daily'
  },
];

export const PrayersPage = () => {
  const { user } = useAuth();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: '', arabic_text: '', translation: '', transliteration: '', category: 'daily'
  });

  useEffect(() => {
    if (user) fetchPrayers();
  }, [user]);

  const fetchPrayers = async () => {
    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .order('is_favorite', { ascending: false })
      .order('created_at', { ascending: false });

    if (!error && data) setPrayers(data);
    setLoading(false);
  };

  const addDefaultPrayers = async () => {
    if (!user) return;
    
    for (const prayer of defaultPrayers) {
      await supabase.from('prayers').insert({ user_id: user.id, ...prayer });
    }
    toast.success('Default prayers added!');
    fetchPrayers();
  };

  const handleSubmit = async () => {
    if (!user || !form.title.trim()) return;

    const { error } = await supabase.from('prayers').insert({ user_id: user.id, ...form });

    if (!error) {
      toast.success('Prayer added!');
      fetchPrayers();
      setIsDialogOpen(false);
      setForm({ title: '', arabic_text: '', translation: '', transliteration: '', category: 'daily' });
    }
  };

  const toggleFavorite = async (prayer: Prayer) => {
    const { error } = await supabase
      .from('prayers')
      .update({ is_favorite: !prayer.is_favorite })
      .eq('id', prayer.id);

    if (!error) fetchPrayers();
  };

  const deletePrayer = async (id: string) => {
    const { error } = await supabase.from('prayers').delete().eq('id', id);
    if (!error) {
      toast.success('Prayer deleted');
      fetchPrayers();
    }
  };

  const filteredPrayers = prayers.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
        <h1 className="text-xl md:text-3xl font-display text-foreground flex items-center gap-2 md:gap-3">
          <Moon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          Kumpulan Doa
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          {prayers.length === 0 && (
            <Button variant="outline" size="sm" onClick={addDefaultPrayers} className="flex-1 sm:flex-none text-xs">
              Add Default
            </Button>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gaming" size="sm" className="gap-2 flex-1 sm:flex-none">
                <Plus className="w-4 h-4" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-base md:text-lg">Add New Prayer</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 md:space-y-4 pt-3 md:pt-4">
                <Input
                  placeholder="Prayer title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="text-sm"
                />
                <Textarea
                  placeholder="Arabic text"
                  value={form.arabic_text}
                  onChange={(e) => setForm({ ...form, arabic_text: e.target.value })}
                  className="text-right text-lg md:text-xl font-arabic"
                  dir="rtl"
                  rows={2}
                />
                <Input
                  placeholder="Transliteration"
                  value={form.transliteration}
                  onChange={(e) => setForm({ ...form, transliteration: e.target.value })}
                  className="text-sm"
                />
                <Textarea
                  placeholder="Translation"
                  value={form.translation}
                  onChange={(e) => setForm({ ...form, translation: e.target.value })}
                  className="text-sm"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} className="flex-1">Cancel</Button>
                  <Button variant="gaming" size="sm" onClick={handleSubmit} className="flex-1">Add</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search prayers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-sm"
        />
      </div>

      {/* Prayers List */}
      <div className="space-y-3 md:space-y-4">
        {filteredPrayers.map((prayer) => (
          <div key={prayer.id} className="card-gaming rounded-lg md:rounded-xl p-3 md:p-5 space-y-2 md:space-y-4 group">
            <div className="flex items-start justify-between">
              <h3 className="font-display text-sm md:text-lg text-foreground">{prayer.title}</h3>
              <div className="flex gap-1.5 md:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleFavorite(prayer)} className="p-1 md:p-1.5 hover:text-accent">
                  <Star className={cn("w-4 h-4 md:w-5 md:h-5", prayer.is_favorite && "fill-accent text-accent")} />
                </button>
                <button onClick={() => deletePrayer(prayer.id)} className="p-1 md:p-1.5 hover:text-destructive">
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
            
            {prayer.arabic_text && (
              <p className="text-lg md:text-2xl text-foreground text-right leading-loose" dir="rtl">
                {prayer.arabic_text}
              </p>
            )}
            
            {prayer.transliteration && (
              <p className="text-xs md:text-sm text-primary font-body italic">
                {prayer.transliteration}
              </p>
            )}
            
            {prayer.translation && (
              <p className="text-xs md:text-sm text-muted-foreground font-body">
                {prayer.translation}
              </p>
            )}
          </div>
        ))}
      </div>

      {filteredPrayers.length === 0 && !loading && (
        <div className="text-center py-8 md:py-12 text-muted-foreground font-body text-sm">
          No prayers yet. Add your first prayer or load default prayers!
        </div>
      )}
    </div>
  );
};
