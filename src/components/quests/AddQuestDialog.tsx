import { useState } from 'react';
import { Quest, Category } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { Label } from '@/components/ui/label';

interface AddQuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (quest: Omit<Quest, 'id' | 'completed'>) => void;
}

const categories: Category[] = ['health', 'productivity', 'social', 'learning', 'creative'];

export const AddQuestDialog = ({ open, onOpenChange, onAdd }: AddQuestDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('productivity');
  const [xpReward, setXpReward] = useState(50);
  const [image, setImage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title,
      description,
      category,
      xpReward,
      image: image || undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('productivity');
    setXpReward(50);
    setImage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">New Quest</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Quest Image (Optional)</Label>
            <ImageUpload 
              currentImage={image}
              onImageChange={setImage}
              variant="card"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quest title..."
              className="bg-muted border-border font-body"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your quest..."
              className="bg-muted border-border font-body resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label className="font-body text-sm text-muted-foreground">XP Reward</Label>
              <Input
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                min={10}
                max={500}
                className="bg-muted border-border font-body"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="gaming" className="flex-1">
              Create Quest
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
