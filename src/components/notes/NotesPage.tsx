import { useState, useEffect } from 'react';
import { FileText, Plus, Pin, Trash2, Search, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  title: string;
  content: string | null;
  category: string;
  is_pinned: boolean;
  created_at: string;
}

export const NotesPage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'general' });

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (!error && data) setNotes(data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user || !form.title.trim()) return;

    if (editingNote) {
      const { error } = await supabase
        .from('notes')
        .update({ title: form.title, content: form.content, category: form.category })
        .eq('id', editingNote.id);

      if (!error) {
        toast.success('Note updated!');
        fetchNotes();
      }
    } else {
      const { error } = await supabase
        .from('notes')
        .insert({ user_id: user.id, title: form.title, content: form.content, category: form.category });

      if (!error) {
        toast.success('Note created!');
        fetchNotes();
      }
    }

    setIsDialogOpen(false);
    setEditingNote(null);
    setForm({ title: '', content: '', category: 'general' });
  };

  const togglePin = async (note: Note) => {
    const { error } = await supabase
      .from('notes')
      .update({ is_pinned: !note.is_pinned })
      .eq('id', note.id);

    if (!error) fetchNotes();
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (!error) {
      toast.success('Note deleted');
      fetchNotes();
    }
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setForm({ title: note.title, content: note.content || '', category: note.category });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          Knowledge Vault
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingNote(null);
            setForm({ title: '', content: '', category: 'general' });
          }
        }}>
          <DialogTrigger asChild>
            <Button variant="gaming" className="gap-2">
              <Plus className="w-4 h-4" /> New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingNote ? 'Edit Note' : 'New Note'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Note title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Textarea
                placeholder="Write your note..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={6}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button variant="gaming" onClick={handleSubmit}>
                  {editingNote ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Notes Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className={cn(
              "card-gaming rounded-xl p-4 space-y-3 group hover:ring-1 hover:ring-primary/50 transition-all",
              note.is_pinned && "ring-1 ring-accent/50"
            )}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-display text-foreground line-clamp-1">{note.title}</h3>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => togglePin(note)} className="p-1 hover:text-accent">
                  <Pin className={cn("w-4 h-4", note.is_pinned && "fill-accent text-accent")} />
                </button>
                <button onClick={() => openEdit(note)} className="p-1 hover:text-primary">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => deleteNote(note.id)} className="p-1 hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-body line-clamp-3">
              {note.content || 'No content'}
            </p>
            <p className="text-xs text-muted-foreground/70 font-body">
              {new Date(note.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && !loading && (
        <div className="text-center py-12 text-muted-foreground font-body">
          No notes yet. Create your first note!
        </div>
      )}
    </div>
  );
};
