import { useState } from 'react';
import { Habit, Category } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { Label } from '@/components/ui/label';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (habit: Omit<Habit, 'id' | 'streak' | 'completedToday'>) => void;
}

const categories: Category[] = ['health', 'productivity', 'social', 'learning', 'creative'];
const icons = ['💪', '🧘', '📚', '💧', '🏃', '🎨', '💻', '📝', '🎵', '🌱', '⭐', '🎯'];

export const AddHabitDialog = ({ open, onOpenChange, onAdd }: AddHabitDialogProps) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💪');
  const [category, setCategory] = useState<Category>('health');
  const [image, setImage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name,
      icon,
      category,
      image: image || undefined,
    });

    // Reset form
    setName('');
    setIcon('💪');
    setCategory('health');
    setImage('');
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

          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger className="bg-muted border-border font-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} className="font-body capitalize">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="gaming" className="flex-1">
              Create Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
