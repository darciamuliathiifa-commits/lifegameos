import { useState } from 'react';
import { Goal, Category } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { Label } from '@/components/ui/label';

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (goal: Omit<Goal, 'id' | 'progress'>) => void;
}

const categories: Category[] = ['health', 'productivity', 'social', 'learning', 'creative'];

export const AddGoalDialog = ({ open, onOpenChange, onAdd }: AddGoalDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('productivity');
  const [target, setTarget] = useState(10);
  const [xpReward, setXpReward] = useState(500);
  const [deadline, setDeadline] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;

    onAdd({
      title,
      description,
      category,
      target,
      xpReward,
      deadline,
      image: image || undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('productivity');
    setTarget(10);
    setXpReward(500);
    setDeadline('');
    setImage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">New Goal</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Cover Image (Optional)</Label>
            <ImageUpload 
              currentImage={image}
              onImageChange={setImage}
              variant="banner"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter goal title..."
              className="bg-muted border-border font-body"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your goal..."
              className="bg-muted border-border font-body resize-none"
              rows={2}
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
              <Label className="font-body text-sm text-muted-foreground">Target</Label>
              <Input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                min={1}
                className="bg-muted border-border font-body"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-body text-sm text-muted-foreground">XP Reward</Label>
              <Input
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                min={100}
                max={5000}
                className="bg-muted border-border font-body"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-body text-sm text-muted-foreground">Deadline</Label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-muted border-border font-body"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="gaming" className="flex-1">
              Create Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
