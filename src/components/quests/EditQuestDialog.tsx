import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Quest, Category } from '@/types/game';

interface EditQuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quest: Quest | null;
  onSave: (questId: string, updates: { title?: string; description?: string; xpReward?: number; category?: string }) => void;
}

const categories: Category[] = ['health', 'productivity', 'social', 'learning', 'creative'];

const categoryLabels: Record<Category, string> = {
  health: 'Kesehatan',
  productivity: 'Produktivitas',
  social: 'Sosial',
  learning: 'Pembelajaran',
  creative: 'Kreativitas',
};

export const EditQuestDialog = ({ open, onOpenChange, quest, onSave }: EditQuestDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState(10);
  const [category, setCategory] = useState<Category>('productivity');

  useEffect(() => {
    if (quest) {
      setTitle(quest.title);
      setDescription(quest.description);
      setXpReward(quest.xpReward);
      setCategory(quest.category);
    }
  }, [quest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quest || !title.trim()) return;
    
    onSave(quest.id, { title, description, xpReward, category });
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
              <Label htmlFor="xp">XP Reward</Label>
              <Input
                id="xp"
                type="number"
                min={1}
                max={1000}
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
              />
            </div>
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