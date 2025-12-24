import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Quest, Category, Difficulty, DIFFICULTY_XP, DIFFICULTY_LABELS } from '@/types/game';

interface EditQuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quest: Quest | null;
  onSave: (questId: string, updates: { title?: string; description?: string; xpReward?: number; category?: string; difficulty?: string }) => void;
}

const categories: Category[] = ['health', 'productivity', 'social', 'learning', 'creative'];
const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

const categoryLabels: Record<Category, string> = {
  health: 'Kesehatan',
  productivity: 'Produktivitas',
  social: 'Sosial',
  learning: 'Pembelajaran',
  creative: 'Kreativitas',
};

const difficultyColors: Record<Difficulty, string> = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hard: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export const EditQuestDialog = ({ open, onOpenChange, quest, onSave }: EditQuestDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('productivity');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const xpReward = DIFFICULTY_XP[difficulty];

  useEffect(() => {
    if (quest) {
      setTitle(quest.title);
      setDescription(quest.description);
      setCategory(quest.category);
      setDifficulty((quest.difficulty as Difficulty) || 'medium');
    }
  }, [quest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quest || !title.trim()) return;
    
    onSave(quest.id, { title, description, xpReward, category, difficulty });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Edit Misi</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Misi</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul misi..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi misi (opsional)..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {categoryLabels[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(diff => (
                    <SelectItem key={diff} value={diff}>
                      <div className="flex items-center gap-2">
                        <span>{DIFFICULTY_LABELS[diff]}</span>
                        <Badge variant="outline" className={difficultyColors[diff]}>
                          +{DIFFICULTY_XP[diff]} XP
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg text-center">
            <span className="text-sm text-muted-foreground">XP yang akan didapat: </span>
            <span className="text-lg font-display text-primary">{xpReward} XP</span>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" variant="gaming">
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};