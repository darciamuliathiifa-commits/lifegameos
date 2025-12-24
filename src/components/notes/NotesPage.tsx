import { useState, useEffect } from 'react';
import { FileText, Plus, Pin, Trash2, Search, Edit2, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { NoteDetailSheet } from './NoteDetailSheet';
import { format } from 'date-fns';

interface Note {
  id: string;
  title: string;
  content: string | null;
  category: string;
  is_pinned: boolean;
  created_at: string;
}

// Example notes for first-time users
const exampleNotes = [
  {
    title: 'Welcome to Knowledge Vault!',
    content: '## Getting Started\n\nWelcome to your personal knowledge vault! Here you can:\n\n### Features\n- [ ] Create notes for any topic\n- [ ] Pin important notes\n- [ ] Organize by category\n- [ ] Search through all your notes\n\n### Tips\n- Use the quick menu in Spaces to create notes from templates\n- Click on a note to view it in a comfortable reading mode\n- Use markdown-style formatting for better organization',
    category: 'general'
  },
  {
    title: 'My Goals for This Month',
    content: '## Monthly Goals\n\n### Personal\n- [ ] Read 2 books\n- [ ] Exercise 3x per week\n- [ ] Learn something new\n\n### Professional\n- [ ] Complete online course\n- [ ] Network with 5 new people\n- [ ] Update portfolio\n\n### Notes\nTrack progress weekly and adjust as needed.',
    category: 'goals'
  }
];

export const NotesPage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
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

  const addExampleNotes = async () => {
    if (!user) return;
    
    for (const note of exampleNotes) {
      await supabase.from('notes').insert({ user_id: user.id, ...note });
    }
    toast.success('Example notes added!');
    fetchNotes();
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
        // Update selected note if viewing
        if (selectedNote?.id === editingNote.id) {
          setSelectedNote({ ...editingNote, ...form });
        }
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

    if (!error) {
      fetchNotes();
      if (selectedNote?.id === note.id) {
        setSelectedNote({ ...note, is_pinned: !note.is_pinned });
      }
    }
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
    setIsSheetOpen(false);
  };

  const openNoteDetail = (note: Note) => {
    setSelectedNote(note);
    setIsSheetOpen(true);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      planner: 'bg-blue-500/20 text-blue-400',
      meal: 'bg-orange-500/20 text-orange-400',
      bookshelf: 'bg-purple-500/20 text-purple-400',
      goals: 'bg-emerald-500/20 text-emerald-400',
      habits: 'bg-pink-500/20 text-pink-400',
      travel: 'bg-cyan-500/20 text-cyan-400',
      movies: 'bg-red-500/20 text-red-400',
      vision: 'bg-indigo-500/20 text-indigo-400',
      journal: 'bg-amber-500/20 text-amber-400',
      workout: 'bg-rose-500/20 text-rose-400',
      finance: 'bg-green-500/20 text-green-400',
      health: 'bg-teal-500/20 text-teal-400',
      general: 'bg-gray-500/20 text-gray-400',
    };
    return colors[category] || colors.general;
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          Knowledge Vault
        </h1>
        <div className="flex gap-2">
          {notes.length === 0 && !loading && (
            <Button variant="outline" onClick={addExampleNotes}>
              Add Examples
            </Button>
          )}
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
                  placeholder="Write your note... (Markdown supported)"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={10}
                  className="font-mono text-sm"
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
            onClick={() => openNoteDetail(note)}
            className={cn(
              "card-gaming rounded-xl p-4 space-y-3 group hover:ring-1 hover:ring-primary/50 transition-all cursor-pointer",
              note.is_pinned && "ring-1 ring-accent/50"
            )}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-display text-foreground line-clamp-1">{note.title}</h3>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
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
              {note.content?.replace(/^##?\s+/gm, '').replace(/- \[[ x]\] /g, '• ') || 'No content'}
            </p>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={cn("text-xs", getCategoryColor(note.category))}>
                {note.category}
              </Badge>
              <p className="text-xs text-muted-foreground/70 font-body flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(note.created_at), 'MMM d')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && !loading && (
        <div className="text-center py-12 text-muted-foreground font-body">
          No notes yet. Create your first note or add examples!
        </div>
      )}

      {/* Half-page Sheet for reading */}
      <NoteDetailSheet
        note={selectedNote}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onEdit={openEdit}
        onDelete={deleteNote}
        onTogglePin={togglePin}
      />
    </div>
  );
};
