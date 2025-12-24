import { useState } from 'react';
import { Habit, Category, Difficulty, DIFFICULTY_XP } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { Label } from '@/components/ui/label';

export type RepeatFrequency = 'daily' | 'weekly' | 'monthly';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (habit: Omit<Habit, 'id' | 'streak' | 'completedToday'> & { repeatFrequency: RepeatFrequency; difficulty: Difficulty; xpReward: number }) => void;
}

const categories: Category[] = ['health', 'productivity', 'social', 'learning', 'creative'];
const icons = ['💪', '🧘', '📚', '💧', '🏃', '🎨', '💻', '📝', '🎵', '🌱', '⭐', '🎯'];

const categoryLabels: Record<Category, string> = {
  health: 'Kesehatan',
  productivity: 'Produktivitas',
  social: 'Sosial',
  learning: 'Pembelajaran',
  creative: 'Kreativitas',
};

const frequencyLabels: Record<RepeatFrequency, string> = {
  daily: 'Setiap Hari',
  weekly: 'Setiap Minggu',
  monthly: 'Setiap Bulan',
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Mudah',
  medium: 'Sedang',
  hard: 'Sulit',
  very_hard: 'Sangat Sulit',
};

export const AddHabitDialog = ({ open, onOpenChange, onAdd }: AddHabitDialogProps) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💪');
  const [category, setCategory] = useState<Category>('health');
  const [image, setImage] = useState('');
  const [repeatFrequency, setRepeatFrequency] = useState<RepeatFrequency>('daily');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name,
      icon,
      category,
      image: image || undefined,
      repeatFrequency,
      difficulty,
      xpReward: DIFFICULTY_XP[difficulty],
    });

    // Reset form
    setName('');
    setIcon('💪');
    setCategory('health');
    setImage('');
    setRepeatFrequency('daily');
    setDifficulty('medium');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">New Habit</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Habit Image (Optional)</Label>
            <ImageUpload 
              currentImage={image}
              onImageChange={setImage}
              variant="card"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Habit Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter habit name..."
              className="bg-muted border-border font-body"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Icon</Label>
            <div className="flex flex-wrap gap-2">
              {icons.map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                    icon === i
                      ? 'bg-primary/30 shadow-[0_0_15px_hsl(var(--primary)/0.4)]'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-body text-sm text-muted-foreground">Kategori</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="bg-muted border-border font-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="font-body">
                      {categoryLabels[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-body text-sm text-muted-foreground">Pengulangan</Label>
              <Select value={repeatFrequency} onValueChange={(v) => setRepeatFrequency(v as RepeatFrequency)}>
                <SelectTrigger className="bg-muted border-border font-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {(Object.keys(frequencyLabels) as RepeatFrequency[]).map(freq => (
                    <SelectItem key={freq} value={freq} className="font-body">
                      {frequencyLabels[freq]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Tingkat Kesulitan (XP)</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['easy', 'medium', 'hard', 'very_hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`p-2 rounded-lg text-xs font-body transition-all ${
                    difficulty === d
                      ? 'bg-primary/30 border border-primary shadow-[0_0_10px_hsl(var(--primary)/0.3)]'
                      : 'bg-muted border border-transparent hover:bg-muted/80'
                  }`}
                >
                  <div className="font-medium">{difficultyLabels[d]}</div>
                  <div className="text-muted-foreground">+{DIFFICULTY_XP[d]} XP</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Batal
            </Button>
            <Button type="submit" variant="gaming" className="flex-1">
              Buat Kebiasaan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
