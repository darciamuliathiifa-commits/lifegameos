import { useState } from 'react';
import { Quest, Category, Difficulty, DIFFICULTY_XP, DIFFICULTY_LABELS } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface AddQuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (quest: Omit<Quest, 'id' | 'completed'>) => void;
}

const categories: Category[] = ['health', 'productivity', 'social', 'learning', 'creative'];

const categoryLabels: Record<Category, string> = {
  health: 'Kesehatan',
  productivity: 'Produktivitas',
  social: 'Sosial',
  learning: 'Pembelajaran',
  creative: 'Kreativitas',
};

const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

const difficultyColors: Record<Difficulty, string> = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hard: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export const AddQuestDialog = ({ open, onOpenChange, onAdd }: AddQuestDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('productivity');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [image, setImage] = useState('');

  const xpReward = DIFFICULTY_XP[difficulty];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title,
      description,
      category,
      xpReward,
      image: image || undefined,
      difficulty,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('productivity');
    setDifficulty('medium');
    setImage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">Misi Baru</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Gambar Misi (Opsional)</Label>
            <ImageUpload 
              currentImage={image}
              onImageChange={setImage}
              variant="card"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Judul</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul misi..."
              className="bg-muted border-border font-body"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Deskripsi</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan misi Anda..."
              className="bg-muted border-border font-body resize-none"
              rows={3}
            />
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
              <Label className="font-body text-sm text-muted-foreground">Tingkat Kesulitan</Label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                <SelectTrigger className="bg-muted border-border font-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {difficulties.map(diff => (
                    <SelectItem key={diff} value={diff} className="font-body">
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

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Batal
            </Button>
            <Button type="submit" variant="gaming" className="flex-1">
              Buat Misi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
