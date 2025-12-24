import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface QuickNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNoteCreated?: () => void;
}

const categories = [
  { value: 'general', label: 'Umum' },
  { value: 'planner', label: 'Perencana' },
  { value: 'journal', label: 'Jurnal' },
  { value: 'goals', label: 'Tujuan' },
  { value: 'habits', label: 'Kebiasaan' },
  { value: 'finance', label: 'Keuangan' },
  { value: 'health', label: 'Kesehatan' },
  { value: 'meal', label: 'Makanan' },
  { value: 'travel', label: 'Perjalanan' },
  { value: 'workout', label: 'Olahraga' },
  { value: 'bookshelf', label: 'Buku' },
  { value: 'movies', label: 'Film' },
  { value: 'vision', label: 'Visi' },
];

export const QuickNoteDialog = ({ open, onOpenChange, onNoteCreated }: QuickNoteDialogProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;
    
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title: title.trim(),
        content: content || null,
        category,
      });

    if (error) {
      toast.error('Gagal membuat catatan');
    } else {
      toast.success('Catatan berhasil dibuat!');
      setTitle('');
      setContent('');
      setCategory('general');
      onNoteCreated?.();
      onOpenChange(false);
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Catatan Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note-title">Judul</Label>
            <Input
              id="note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul catatan..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note-category">Kategori</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note-content">Isi Catatan</Label>
            <Textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis catatan Anda... (Markdown didukung)"
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" variant="gaming" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Catatan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};